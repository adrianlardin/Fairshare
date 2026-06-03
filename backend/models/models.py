from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from typing import Optional
from database import db



# usuarios de la app

class User(db.Model): 
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    user_name: Mapped[str] = mapped_column(String(36), nullable=False)
    name: Mapped[str] = mapped_column(String(36), nullable=False)
    last_name: Mapped[str] = mapped_column(String(36), nullable=False)
    avatar: Mapped[Optional[str]] = mapped_column(String(255))

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "user_name": self.user_name,
            "name": self.name,
            "last_name": self.last_name,
            "avatar": self.avatar
        }
    

# Grupo de gastos

class Group(db.Model):
    __tablename__ = "expense_group"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255))
    category: Mapped[Optional[str]] = mapped_column(String(60))
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow) # fecha de creacion del grupo

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat()
        }
    

# Quien pertenece a cada grupo

class GroupMember(db.Model):
    __tablename__ = "group_member"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("expense_group.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="member")  # admin o member
    joined_at: Mapped[datetime] = mapped_column(default=datetime.utcnow) # fecha que se unio el miembro al grupo

    def serialize(self):
        return {
            "group_id": self.group_id,
            "user_id": self.user_id,
            "role": self.role,
            "joined_at": self.joined_at.isoformat()
        }
    

# Gastos registrados en el grupo

class Expense(db.Model):
    __tablename__ = "expense"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)
    paid_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    group_id: Mapped[int] = mapped_column(ForeignKey("expense_group.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "amount": self.amount,
            "paid_by": self.paid_by,
            "group_id": self.group_id,
            "created_at": self.created_at.isoformat()
        }


# Como se dividen los gastos

class ExpenseSplit(db.Model):
    __tablename__ = "expense_split"

    id: Mapped[int] = mapped_column(primary_key=True)
    expense_id: Mapped[int] = mapped_column(ForeignKey("expense.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)  # cuánto debe este usuario

    def serialize(self):
        return {
            "expense_id": self.expense_id,
            "user_id": self.user_id,
            "amount": self.amount
        }
    

# Pagos para saldar las deudas

class Settlement(db.Model):
    __tablename__ = "settlement"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("expense_group.id"), nullable=False)
    paid_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)  # quien paga
    paid_to: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)  # quien recibe
    amount: Mapped[float] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "paid_by": self.paid_by,
            "paid_to": self.paid_to,
            "amount": self.amount,
            "created_at": self.created_at.isoformat()
        }
