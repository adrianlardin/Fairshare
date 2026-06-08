from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import User
from database import db
import bcrypt

user_bp = Blueprint("user", __name__)


@user_bp.route("/user/<int:user_id>", methods=["GET"])
@jwt_required() # verifica que traiga un token JWT válido, si no hay token válido devuelve un error 401
def get_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200


@user_bp.route("/user/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()

    # comprueba que el usuario solo pueda editar su propio perfil
    if str(user_id) != current_user_id:
        return jsonify({"error": "No tienes permiso para editar este usuario"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    # actualiza solo los campos que vengan en la peticion
    if "user_name" in data:
        user.user_name = data["user_name"]
    if "name" in data:
        user.name = data["name"]
    if "last_name" in data:
        user.last_name = data["last_name"]
    if "avatar" in data:
        user.avatar = data["avatar"]
    if "password" in data:
        user.password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # guarda los cambios en la base de datos
    db.session.commit()

    return jsonify(user.serialize()), 200


@user_bp.route("/user/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()

    # comprueba que el usuario solo pueda eliminar su propia cuenta
    if str(user_id) != current_user_id:
        return jsonify({"error": "No tienes permiso para eliminar este usuario"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # elimina el usuario de la base de datos
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Usuario eliminado correctamente"}), 200
