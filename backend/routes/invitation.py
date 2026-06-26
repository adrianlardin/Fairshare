from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Invitation, GroupMember, User, Group
from database import db
import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

invitation_bp = Blueprint("invitation", __name__)


@invitation_bp.route("/group/<int:group_id>/invite", methods=["POST"])
@jwt_required()
def invite_member(group_id):
    current_user_id = int(get_jwt_identity())

    # solo el admin puede invitar
    admin = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not admin:
        return jsonify({"error": "No tienes permiso para invitar miembros"}), 403

    # comprueba que el grupo existe
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Grupo no encontrado"}), 404

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "El email es obligatorio"}), 400

    # comprueba que no haya una invitacion pendiente para ese email en ese grupo
    existing = Invitation.query.filter_by(group_id=group_id, email=email, status="pending").first()
    if existing:
        return jsonify({"error": "Ya existe una invitación pendiente para ese email"}), 400

    new_invitation = Invitation(
        group_id=group_id,
        invited_by=current_user_id,
        email=email
    )

    db.session.add(new_invitation)
    db.session.commit()

    # enlace que recibirá el usuario en el correo
    invite_link = f"{os.getenv('FRONTEND_URL')}/invite/{new_invitation.token}"

    # envia el email con Resend
    resend.Emails.send({
        "from": "Fairshare <onboarding@resend.dev>",
        "to": email,
        "subject": f"Te han invitado al grupo {group.name}",
        "html": f"""
            <h2>Tienes una invitación</h2>
            <p>Te han invitado a unirte al grupo <strong>{group.name}</strong> en Fairshare.</p>
            <a href="{invite_link}">Aceptar invitación</a>
        """
    })

    return jsonify(new_invitation.serialize()), 201


@invitation_bp.route("/group/<int:group_id>/invitations", methods=["GET"])
@jwt_required()
def get_invitations(group_id):
    current_user_id = int(get_jwt_identity())

    # solo el admin puede ver las invitaciones
    admin = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not admin:
        return jsonify({"error": "No tienes permiso para ver las invitaciones"}), 403

    invitations = Invitation.query.filter_by(group_id=group_id).all()

    return jsonify([i.serialize() for i in invitations]), 200


@invitation_bp.route("/invitation/<string:token>/accept", methods=["POST"])
def accept_invitation(token):
    invitation = Invitation.query.filter_by(token=token, status="pending").first()
    if not invitation:
        return jsonify({"error": "Invitación no válida o ya utilizada"}), 404

    # comprueba que el usuario existe con ese email
    user = User.query.filter_by(email=invitation.email).first()
    if not user:
        return jsonify({"error": "Debes registrarte antes de aceptar la invitación"}), 400

    # comprueba que no sea ya miembro
    existing = GroupMember.query.filter_by(group_id=invitation.group_id, user_id=user.id).first()
    if existing:
        return jsonify({"error": "Ya eres miembro de este grupo"}), 400

    # añade al usuario como miembro del grupo
    new_member = GroupMember(
        group_id=invitation.group_id,
        user_id=user.id,
        role="member"
    )

    db.session.add(new_member)

    # marca la invitacion como aceptada
    invitation.status = "accepted"

    db.session.commit()

    return jsonify({"message": "Te has unido al grupo correctamente"}), 200


