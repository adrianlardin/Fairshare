from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Group, GroupMember, Expense, ExpenseSplit, Settlement, User
from database import db

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


@group_bp.route("/group", methods=["POST"])
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


@group_bp.route("/group/<int:group_id>", methods=["GET"])
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


@group_bp.route("/group/<int:group_id>", methods=["PUT"])
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

    db.session.commit()

    return jsonify(group.serialize()), 200


@group_bp.route("/group/<int:group_id>", methods=["DELETE"])
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


#    MIEMBROS 

@group_bp.route("/group/<int:group_id>/members", methods=["POST"])
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


@group_bp.route("/group/<int:group_id>/members/<int:user_id>", methods=["DELETE"])
@jwt_required()
def remove_member(group_id, user_id):
    current_user_id = int(get_jwt_identity())

    # solo el admin puede eliminar miembros
    admin = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id, role="admin").first()
    if not admin:
        return jsonify({"error": "No tienes permiso para eliminar miembros"}), 403

    member = GroupMember.query.filter_by(group_id=group_id, user_id=user_id).first()
    if not member:
        return jsonify({"error": "Miembro no encontrado"}), 404

    db.session.delete(member)
    db.session.commit()

    return jsonify({"message": "Miembro eliminado correctamente"}), 200


#    GASTOS 

@group_bp.route("/group/<int:group_id>/expenses", methods=["GET"])
def get_expenses():

    return jsonify({"message": "Gastos"}), 200


@group_bp.route("/group/<int:group_id>/expenses", methods=["POST"])
def create_expense():

    return jsonify({"message": "Gasto creado"}), 201


@group_bp.route("/expense/<int:expense_id>", methods=["DELETE"])
def delete_expense():

    return jsonify({"message": "Gasto eliminado"}), 200


#    PAGOS 

@group_bp.route("/group/<int:group_id>/settlements", methods=["GET"])
def get_settlements():

    return jsonify({"message": "Pagos"}), 200


@group_bp.route("/group/<int:group_id>/settlements", methods=["POST"])
def create_settlement():

    return jsonify({"message": "Pago creado"}), 201