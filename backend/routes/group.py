from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Group, GroupMember, Expense, ExpenseSplit, Settlement, User
from database import db
from sqlalchemy import or_, and_
import secrets
import os

group_bp = Blueprint("group", __name__)


#     GRUPOS 

@group_bp.route("/groups", methods=["GET"])
@jwt_required()
def get_groups():
    current_user_id = int(get_jwt_identity())

    # obtiene todos los grupos donde el usuario es miembro
    memberships = GroupMember.query.filter_by(user_id=current_user_id).all()
    group_ids = [m.group_id for m in memberships]
    groups = Group.query.filter(Group.id.in_(group_ids)).all()

    return jsonify([g.serialize() for g in groups]), 200


@group_bp.route("/groups", methods=["POST"])
@jwt_required()
def create_group():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    name = data.get("name")

    if not name:
        return jsonify({"error": "El nombre del grupo es obligatorio"}), 400

    new_group = Group(
        name=name,
        description=data.get("description"),
        category=data.get("category"),
        image=data.get("image"),
        created_by=current_user_id
    )

    db.session.add(new_group)
    db.session.flush()  # para obtener el id del grupo antes del commit

    # el creador se añade automaticamente como admin del grupo
    member = GroupMember(
        group_id=new_group.id,
        user_id=current_user_id,
        role="admin"
    )

    db.session.add(member)
    db.session.commit()

    return jsonify(new_group.serialize()), 201


@group_bp.route("/groups/<int:group_id>", methods=["GET"])
@jwt_required()
def get_group(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Grupo no encontrado"}), 404

    return jsonify(group.serialize()), 200


@group_bp.route("/groups/<int:group_id>", methods=["PUT"])
@jwt_required()
def update_group(group_id):
    current_user_id = int(get_jwt_identity())

    # solo el admin puede editar el grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not member:
        return jsonify({"error": "No tienes permiso para editar este grupo"}), 403

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Grupo no encontrado"}), 404

    data = request.get_json()

    if "name" in data:
        group.name = data["name"]
    if "description" in data:
        group.description = data["description"]
    if "category" in data:
        group.category = data["category"]
    if "image" in data:                    
        group.image = data["image"]    

    db.session.commit()

    return jsonify(group.serialize()), 200


@group_bp.route("/groups/<int:group_id>", methods=["DELETE"])
@jwt_required()
def delete_group(group_id):
    current_user_id = int(get_jwt_identity())

    # solo el admin puede eliminar el grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not member:
        return jsonify({"error": "No tienes permiso para eliminar este grupo"}), 403

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Grupo no encontrado"}), 404

    db.session.delete(group)
    db.session.commit()

    return jsonify({"message": "Grupo eliminado correctamente"}), 200


#    INVITACION POR LINK 

@group_bp.route("/groups/<int:group_id>/invite-link", methods=["GET"])
@jwt_required()
def get_invite_link(group_id):
    current_user_id = int(get_jwt_identity())

    admin = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not admin:
        return jsonify({"error": "No tienes permiso para obtener el link de invitacion"}), 403

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Grupo no encontrado"}), 404

    if not group.invite_token:
        group.generate_invite_token()
        db.session.commit()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    invite_link = f"{frontend_url}/invite/{group.invite_token}"

    return jsonify({"invite_token": group.invite_token, "invite_link": invite_link}), 200


@group_bp.route("/groups/<int:group_id>/invite-link", methods=["POST"])
@jwt_required()
def regenerate_invite_link(group_id):
    current_user_id = int(get_jwt_identity())

    admin = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not admin:
        return jsonify({"error": "No tienes permiso para regenerar el link de invitacion"}), 403

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Grupo no encontrado"}), 404

    group.generate_invite_token()
    db.session.commit()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    invite_link = f"{frontend_url}/invite/{group.invite_token}"

    return jsonify({"invite_token": group.invite_token, "invite_link": invite_link}), 200


@group_bp.route("/groups/join/<string:token>", methods=["POST"])
@jwt_required()
def join_by_token(token):
    current_user_id = int(get_jwt_identity())

    group = Group.query.filter_by(invite_token=token).first()
    if not group:
        return jsonify({"error": "Link de invitacion no valido"}), 404

    existing = GroupMember.query.filter_by(group_id=group.id, user_id=current_user_id).first()
    if existing:
        return jsonify({"error": "Ya eres miembro de este grupo", "group_id": group.id}), 200

    new_member = GroupMember(group_id=group.id, user_id=current_user_id, role="member")
    db.session.add(new_member)
    db.session.commit()

    return jsonify({"message": "Te has unido al grupo correctamente", "group_id": group.id}), 200


#    MIEMBROS 

@group_bp.route("/groups/<int:group_id>/members", methods=["GET"])
@jwt_required()
def get_members(group_id):
    current_user_id = int(get_jwt_identity())

    # Comprueba que el usuario que consulta pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    # Consulta combinando GroupMember y User
    members_data = db.session.query(GroupMember, User).join(
        User, GroupMember.user_id == User.id
    ).filter(GroupMember.group_id == group_id).all()

    # Construimos la respuesta mapeando exactamente tus campos
    response = []
    for member_info, user_info in members_data:
        response.append({
            "id": member_info.id,
            "user_id": member_info.user_id,
            "group_id": member_info.group_id,
            "role": member_info.role,
            "username": user_info.user_name, # Mapea a 'user_name'
            "avatar_url": user_info.avatar   # <-- ¡Aquí usamos exactamente 'user_info.avatar'!
        })

    return jsonify(response), 200


@group_bp.route("/groups/<int:group_id>/members", methods=["POST"])
@jwt_required()
def add_member(group_id):
    current_user_id = int(get_jwt_identity())

    # solo el admin puede añadir miembros
    admin = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not admin:
        return jsonify({"error": "No tienes permiso para añadir miembros"}), 403

    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id es obligatorio"}), 400

    # comprueba que el usuario existe
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # comprueba que el usuario no sea ya miembro
    existing = GroupMember.query.filter_by(group_id=group_id, user_id=user_id).first()
    if existing:
        return jsonify({"error": "El usuario ya es miembro del grupo"}), 400

    new_member = GroupMember(group_id=group_id, user_id=user_id, role="member")
    db.session.add(new_member)
    db.session.commit()

    return jsonify(new_member.serialize()), 201


@group_bp.route("/groups/<int:group_id>/members/<int:user_id>", methods=["DELETE"])
@jwt_required()
def remove_member(group_id, user_id):
    current_user_id = int(get_jwt_identity())

    # Comprueba si el que ejecuta la acción es admin
    admin = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    
    # NUEVO: Si NO es admin, pero el usuario que intenta borrarse es él mismo (salir del grupo), lo permitimos.
    if not admin and current_user_id != user_id:
        return jsonify({"error": "No tienes permiso para eliminar miembros"}), 403

    member = GroupMember.query.filter_by(group_id=group_id, user_id=user_id).first()
    if not member:
        return jsonify({"error": "Miembro no encontrado"}), 404

    db.session.delete(member)
    db.session.commit()

    return jsonify({"message": "Miembro eliminado correctamente"}), 200


#    GASTOS 

@group_bp.route("/groups/<int:group_id>/expenses", methods=["GET"])
@jwt_required()
def get_expenses(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    expenses = Expense.query.filter_by(group_id=group_id).all()

    return jsonify([e.serialize() for e in expenses]), 200


@group_bp.route("/groups/<int:group_id>/expenses", methods=["POST"])
@jwt_required()
def create_expense(group_id):
    current_user_id = int(get_jwt_identity())

    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    data = request.get_json()
    description = data.get("description")
    amount = data.get("amount")
    splits = data.get("splits")  # lista de { user_id, amount }

    if not description or not amount:
        return jsonify({"error": "Descripcion y cantidad son obligatorios"}), 400

    new_expense = Expense(
        description=description,
        amount=amount,
        paid_by=current_user_id,
        group_id=group_id
    )

    db.session.add(new_expense)
    db.session.flush()

    if splits:
        # calcula cuanto queda para el pagador
        total_splits = sum(s["amount"] for s in splits)
        payer_amount = round(amount - total_splits, 2)

        # split del pagador
        db.session.add(ExpenseSplit(
            expense_id=new_expense.id,
            user_id=current_user_id,
            amount=payer_amount
        ))

        # splits del resto
        for split in splits:
            db.session.add(ExpenseSplit(
                expense_id=new_expense.id,
                user_id=split["user_id"],
                amount=split["amount"]
            ))

    db.session.commit()
    return jsonify(new_expense.serialize()), 201


@group_bp.route("/expense/<int:expense_id>", methods=["DELETE"])
@jwt_required()
def delete_expense(expense_id):
    current_user_id = int(get_jwt_identity())

    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({"error": "Gasto no encontrado"}), 404

    # solo quien pagó el gasto puede eliminarlo
    if expense.paid_by != current_user_id:
        return jsonify({"error": "No tienes permiso para eliminar este gasto"}), 403

    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Gasto eliminado correctamente"}), 200


#    PAGOS 

@group_bp.route("/groups/<int:group_id>/settlements", methods=["GET"])
@jwt_required()
def get_settlements(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    settlements = Settlement.query.filter_by(group_id=group_id).all()

    return jsonify([s.serialize() for s in settlements]), 200


@group_bp.route("/groups/<int:group_id>/settlements", methods=["POST"])
@jwt_required()
def create_settlement(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    data = request.get_json()
    paid_to = data.get("paid_to", None) 
    amount = data.get("amount")

    if not amount or float(amount) <= 0:
        return jsonify({"error": "La cantidad a aportar es obligatoria y mayor a 0"}), 400

    new_settlement = Settlement(
        group_id=group_id,
        paid_by=current_user_id,
        paid_to=paid_to,
        amount=amount,
        status="completed" 
    )

    db.session.add(new_settlement)
    db.session.commit()

    return jsonify(new_settlement.serialize()), 201
@group_bp.route("/settlement/<int:settlement_id>/pay", methods=["PATCH"])
@jwt_required()
def pay_settlement(settlement_id):
    current_user_id = int(get_jwt_identity())

    settlement = db.session.get(Settlement, settlement_id)
    if not settlement:
        return jsonify({"error": "Pago no encontrado"}), 404

    # solo quien debe pagar puede marcarlo como pagado
    if settlement.paid_by != current_user_id:
        return jsonify({"error": "No tienes permiso para realizar este pago"}), 403

    settlement.status = "paid"
    db.session.commit()

    return jsonify(settlement.serialize()), 200