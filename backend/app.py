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

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

CORS(app, resources={r"/*": {"origins": "*"}})
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(group_bp)

@app.route("/")
def home():
    return {"message": "Backend funcionando"}

if __name__ == "__main__":
    app.run(debug=True)