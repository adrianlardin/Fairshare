from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.models import User
from database import db
import bcrypt

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    user_name = data.get("user_name")
    name = data.get("name")
    last_name = data.get("last_name")

    # comprueba que hayan rellenado todos los datos que tenemos obligatorios
    if not email or not password or not user_name or not name or not last_name:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    
    # comprueba si ya existe el email en nuestra base de datos
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya está registrado"}), 400
    
    # convierte la contraseña en hash
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    new_user = User(
        email=email,
        password=hashed_password.decode("utf-8"),
        user_name=user_name,
        name=name,
        last_name=last_name
    )

    # guarda el usuario en la base de datos
    db.session.add(new_user)
    db.session.commit() 

    return jsonify(new_user.serialize()), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # comprueba que hayan rellenado los dos campos
    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    # busca el usuario (email) en la base de datos, si existe lo guarda en la variable user
    user = User.query.filter_by(email=email).first()

    # comprueba si el usuario existe y si coincide la contraseña 
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200