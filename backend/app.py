from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from database import db
from flask_migrate import Migrate
from models.models import User, Group, GroupMember, Expense, ExpenseSplit, Settlement

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def home():
    return {"message": "Backend funcionando"}


if __name__ == "__main__":
    app.run(debug=True)