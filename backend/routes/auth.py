from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.models import User
from database import db
import bcrypt

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    return jsonify({"message": "register"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    return jsonify({"message": "login"}), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    
    return jsonify({"message": "Sesión cerrada"}), 200