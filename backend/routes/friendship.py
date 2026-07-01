from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Friendship, User
from database import db
from sqlalchemy import or_, and_

friend_bp = Blueprint("friend", __name__)


#    SOLICITUDES 

@friend_bp.route("/friends/request", methods=["POST"])
@jwt_required()
def send_friend_request():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    friend_id = data.get("friend_id")
    email = data.get("email")

    # permite buscar por email si no se pasa el id directamente
    if not friend_id and email:
        friend = User.query.filter_by(email=email).first()
        if not friend:
            return jsonify({"error": "Usuario no encontrado"}), 404
        friend_id = friend.id

    if not friend_id:
        return jsonify({"error": "friend_id o email son obligatorios"}), 400

    if friend_id == current_user_id:
        return jsonify({"error": "No puedes enviarte una solicitud a ti mismo"}), 400

    # comprueba que el usuario exista
    friend = User.query.get(friend_id)
    if not friend:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # comprueba si ya existe una relación en cualquier sentido
    existing = Friendship.query.filter(
        or_(
            and_(Friendship.user_id == current_user_id, Friendship.friend_id == friend_id),
            and_(Friendship.user_id == friend_id, Friendship.friend_id == current_user_id)
        )
    ).first()

    if existing:
        if existing.status == "accepted":
            return jsonify({"error": "Ya son amigos"}), 400
        return jsonify({"error": "Ya existe una solicitud pendiente"}), 400

    new_friendship = Friendship(
        user_id=current_user_id,
        friend_id=friend_id,
        status="pending"
    )

    db.session.add(new_friendship)
    db.session.commit()

    return jsonify(new_friendship.serialize()), 201


@friend_bp.route("/friends/requests", methods=["GET"])
@jwt_required()
def get_received_requests():
    current_user_id = int(get_jwt_identity())

    requests = Friendship.query.filter_by(friend_id=current_user_id, status="pending").all()

    return jsonify([
        {**r.serialize(), "user": r.requester.serialize()}
        for r in requests
    ]), 200


@friend_bp.route("/friends/requests/sent", methods=["GET"])
@jwt_required()
def get_sent_requests():
    current_user_id = int(get_jwt_identity())

    requests = Friendship.query.filter_by(user_id=current_user_id, status="pending").all()

    return jsonify([
        {**r.serialize(), "user": r.friend.serialize()}
        for r in requests
    ]), 200


@friend_bp.route("/friends/request/<int:friendship_id>/accept", methods=["PATCH"])
@jwt_required()
def accept_friend_request(friendship_id):
    current_user_id = int(get_jwt_identity())

    friendship = Friendship.query.get(friendship_id)
    if not friendship:
        return jsonify({"error": "Solicitud no encontrada"}), 404

    # solo quien recibió la solicitud puede aceptarla
    if friendship.friend_id != current_user_id:
        return jsonify({"error": "No tienes permiso para aceptar esta solicitud"}), 403

    if friendship.status != "pending":
        return jsonify({"error": "Esta solicitud ya fue procesada"}), 400

    friendship.status = "accepted"
    db.session.commit()

    return jsonify(friendship.serialize()), 200


@friend_bp.route("/friends/request/<int:friendship_id>/reject", methods=["PATCH"])
@jwt_required()
def reject_friend_request(friendship_id):
    current_user_id = int(get_jwt_identity())

    friendship = Friendship.query.get(friendship_id)
    if not friendship:
        return jsonify({"error": "Solicitud no encontrada"}), 404

    # solo quien recibió la solicitud puede rechazarla
    if friendship.friend_id != current_user_id:
        return jsonify({"error": "No tienes permiso para rechazar esta solicitud"}), 403

    if friendship.status != "pending":
        return jsonify({"error": "Esta solicitud ya fue procesada"}), 400

    db.session.delete(friendship)
    db.session.commit()

    return jsonify({"message": "Solicitud rechazada"}), 200




#    AMIGOS 

@friend_bp.route("/friends", methods=["GET"])
@jwt_required()
def get_friends():
    current_user_id = int(get_jwt_identity())

    friendships = Friendship.query.filter(
        or_(
            Friendship.user_id == current_user_id,
            Friendship.friend_id == current_user_id
        ),
        Friendship.status == "accepted"
    ).all()

    friends = []
    for f in friendships:
        # determina quien es "el otro" usuario en la relación
        other_user = f.friend if f.user_id == current_user_id else f.requester
        friends.append({
            "friendship_id": f.id,
            "user": other_user.serialize()
        })

    return jsonify(friends), 200


@friend_bp.route("/friends/<int:friendship_id>", methods=["DELETE"])
@jwt_required()
def remove_friend(friendship_id):
    current_user_id = int(get_jwt_identity())

    friendship = Friendship.query.get(friendship_id)
    if not friendship:
        return jsonify({"error": "Amistad no encontrada"}), 404

    # solo alguno de los dos implicados puede eliminar la amistad
    if friendship.user_id != current_user_id and friendship.friend_id != current_user_id:
        return jsonify({"error": "No tienes permiso para eliminar esta amistad"}), 403

    db.session.delete(friendship)
    db.session.commit()

    return jsonify({"message": "Amistad eliminada correctamente"}), 200