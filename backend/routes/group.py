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

@group_bp.route("/group/<int:group_id>/members", methods=["GET"])
@jwt_required()
def get_members(group_id):
    current_user_id = int(get_jwt_identity())

    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    members = GroupMember.query.filter_by(group_id=group_id).all()
    return jsonify([m.serialize() for m in members]), 200


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
@jwt_required()
def get_expenses(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    expenses = Expense.query.filter_by(group_id=group_id).all()

    return jsonify([e.serialize() for e in expenses]), 200


@group_bp.route("/group/<int:group_id>/expenses", methods=["POST"])
@jwt_required()
def create_expense(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
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

    # crea los splits si vienen en la peticion
    if splits:
        for split in splits:
            new_split = ExpenseSplit(
                expense_id=new_expense.id,
                user_id=split["user_id"],
                amount=split["amount"]
            )
            db.session.add(new_split)

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

@group_bp.route("/group/<int:group_id>/settlements", methods=["GET"])
@jwt_required()
def get_settlements(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    settlements = Settlement.query.filter_by(group_id=group_id).all()

    return jsonify([s.serialize() for s in settlements]), 200


@group_bp.route("/group/<int:group_id>/settlements", methods=["POST"])
@jwt_required()
def create_settlement(group_id):
    current_user_id = int(get_jwt_identity())

    # comprueba que el usuario pertenece al grupo
    member = GroupMember.query.filter_by(group_id=group_id, user_id=current_user_id).first()
    if not member:
        return jsonify({"error": "No tienes acceso a este grupo"}), 403

    data = request.get_json()
    paid_to = data.get("paid_to")
    amount = data.get("amount")

    if not paid_to or not amount:
        return jsonify({"error": "paid_to y amount son obligatorios"}), 400

    new_settlement = Settlement(
        group_id=group_id,
        paid_by=current_user_id,
        paid_to=paid_to,
        amount=amount
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