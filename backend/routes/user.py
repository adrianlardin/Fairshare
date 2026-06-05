from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import User
from database import db
import bcrypt

user_bp = Blueprint("user", __name__)


@user_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user():

    return jsonify({"message": "Usuarios"}), 200


@user_bp.route("/user/<int:user_id>", methods=["PUT"])
def update_user():

    return jsonify({"message": "Usuario modificado correctamente"}), 200


@user_bp.route("/user/<int:user_id>", methods=["DELETE"])
def delete_user():

    return jsonify({"message": "Usuario eliminado correctamente"}), 200
