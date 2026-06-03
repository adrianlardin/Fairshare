from flask import Blueprint, jsonify, request
from database import db

user_bp = Blueprint("user", __name__)

@user_bp.route("/api/user", methods=["GET"])
def get_users():

    return jsonify({"message": "todo funcionando correctamente"})

@user_bp.route("/api/user/register", methods=["POST"])
def register_user():
    body = request.get_json()
    print(body)

    return jsonify({"message": "Registro correctamente"})

@user_bp.route("/api/user/login", methods=["POST"])
def login_user():

    return jsonify({"message": "Logeado correctamente"})