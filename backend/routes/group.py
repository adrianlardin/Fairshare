from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Group, GroupMember, Expense, ExpenseSplit, Settlement, User
from database import db

group_bp = Blueprint("group", __name__)


#     GRUPOS 

@group_bp.route("/groups", methods=["GET"])
def get_groups():

    return jsonify({"message": "Grupos"}), 200


@group_bp.route("/group", methods=["POST"])
def create_group():

    return jsonify({"message": "Grupo creado"}), 201


@group_bp.route("/group/<int:group_id>", methods=["GET"])
def get_group():

    return jsonify({"message": "Grupo"}), 200


@group_bp.route("/group/<int:group_id>", methods=["PUT"])
def update_group():

    return jsonify({"message": "Grupo actualizado"}), 200


@group_bp.route("/group/<int:group_id>", methods=["DELETE"])
def delete_group():

    return jsonify({"message": "Grupo eliminado"}), 200


#    MIEMBROS 

@group_bp.route("/group/<int:group_id>/members", methods=["POST"])
def add_member():

    return jsonify({"message": "Añadir miembro"}), 201


@group_bp.route("/group/<int:group_id>/members/<int:user_id>", methods=["DELETE"])
def remove_member():

    return jsonify({"message": "Miembro eliminado"}), 200


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