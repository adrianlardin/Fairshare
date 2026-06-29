from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from database import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models.models import User, Group, GroupMember, Expense, ExpenseSplit, Settlement
from routes.auth import auth_bp
from routes.user import user_bp
from routes.group import group_bp
from routes.invitation import invitation_bp
from flask import Flask
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "facundok96@gmail.com"
app.config["MAIL_PASSWORD"] = "twmm keey usuu ucur"
app.config["MAIL_DEFAULT_SENDER"] = "facundok96@gmail.com"

mail = Mail(app)

serializer = URLSafeTimedSerializer("TU_PALABRA_SECRETA_SUPER_SECRETA")

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(group_bp)
app.register_blueprint(invitation_bp)

@app.route("/")
def home():
    return {"message": "Backend funcionando"}

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
