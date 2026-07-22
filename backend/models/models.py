from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from typing import Optional, List
from database import db
import secrets


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
    currency = db.Column(db.String(20), default="USD ($)", nullable=True)
    email_notifications = db.Column(db.Boolean, default=False, nullable=True)
    push_notifications = db.Column(db.Boolean, default=False, nullable=True)

    # Relaciones
    groups_created: Mapped[List["Group"]] = relationship(
        back_populates="creator",
        cascade="all, delete-orphan"
    )

    memberships: Mapped[List["GroupMember"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    expenses_paid: Mapped[List["Expense"]] = relationship(
        back_populates="payer",
        cascade="all, delete-orphan"
    )

    splits: Mapped[List["ExpenseSplit"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    settlements_sent: Mapped[List["Settlement"]] = relationship(
        foreign_keys="Settlement.paid_by",
        back_populates="payer",
        cascade="all, delete-orphan"
    )

    settlements_received: Mapped[List["Settlement"]] = relationship(
        foreign_keys="Settlement.paid_to",
        back_populates="receiver",
        cascade="all, delete-orphan"
    )

    invitations_sent: Mapped[List["Invitation"]] = relationship(
        back_populates="sender",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "user_name": self.user_name,
            "name": self.name,
            "last_name": self.last_name,
            "avatar": self.avatar,
            "currency": self.currency,
            "email_notifications": self.email_notifications,
            "push_notifications": self.push_notifications
        }


# grupo de gastos

class Group(db.Model):
    __tablename__ = "expense_group"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255))
    category: Mapped[Optional[str]] = mapped_column(String(60))
    image: Mapped[Optional[str]] = mapped_column(String(255))
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    invite_token: Mapped[Optional[str]] = mapped_column(String(64), unique=True, nullable=True)

    # Relaciones
    creator: Mapped["User"] = relationship(back_populates="groups_created")
    members: Mapped[List["GroupMember"]] = relationship(back_populates="group", cascade="all, delete-orphan")
    expenses: Mapped[List["Expense"]] = relationship(back_populates="group", cascade="all, delete-orphan")
    settlements: Mapped[List["Settlement"]] = relationship(back_populates="group", cascade="all, delete-orphan")
    invitations: Mapped[List["Invitation"]] = relationship(back_populates="group", cascade="all, delete-orphan")

    def generate_invite_token(self):
        self.invite_token = secrets.token_urlsafe(32)
        return self.invite_token

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "image": self.image,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat(),
            "invite_token": self.invite_token
        }


# quien pertenece a cada grupo

class GroupMember(db.Model):
    __tablename__ = "group_member"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("expense_group.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="member")
    joined_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    # Relaciones
    group: Mapped["Group"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="memberships")

    def serialize(self):
        return {
            "group_id": self.group_id,
            "user_id": self.user_id,
            "role": self.role,
            "joined_at": self.joined_at.isoformat(),
            "user": self.user.serialize()
        }


# gastos registrados en el grupo

class Expense(db.Model):
    __tablename__ = "expense"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)
    paid_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    group_id: Mapped[int] = mapped_column(ForeignKey("expense_group.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    # Relaciones
    payer: Mapped["User"] = relationship(back_populates="expenses_paid")
    group: Mapped["Group"] = relationship(back_populates="expenses")
    splits: Mapped[List["ExpenseSplit"]] = relationship(back_populates="expense", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "amount": self.amount,
            "paid_by": self.paid_by,
            "group_id": self.group_id,
            "created_at": self.created_at.isoformat(),
            "splits": [split.serialize() for split in self.splits] 
        }


# como se dividen los gastos

class ExpenseSplit(db.Model):
    __tablename__ = "expense_split"

    id: Mapped[int] = mapped_column(primary_key=True)
    expense_id: Mapped[int] = mapped_column(ForeignKey("expense.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)

    # Relaciones
    expense: Mapped["Expense"] = relationship(back_populates="splits")
    user: Mapped["User"] = relationship(back_populates="splits")

    def serialize(self):
        return {
            "expense_id": self.expense_id,
            "user_id": self.user_id,
            "amount": self.amount
        }


# pagos para saldar las deudas

class Settlement(db.Model):
    __tablename__ = "settlement"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("expense_group.id"), nullable=False)
    paid_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    paid_to: Mapped[Optional[int]] = mapped_column(ForeignKey("user.id"), nullable=True)
    amount: Mapped[float] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    # Relaciones
    group: Mapped["Group"] = relationship(back_populates="settlements")
    payer: Mapped["User"] = relationship(foreign_keys=[paid_by], back_populates="settlements_sent")
    receiver: Mapped[Optional["User"]] = relationship(foreign_keys=[paid_to], back_populates="settlements_received")

    def serialize(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "paid_by": self.paid_by,
            "paid_to": self.paid_to,
            "amount": self.amount,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }


# invitaciones para unirse a un grupo

class Invitation(db.Model):
    __tablename__ = "invitation"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("expense_group.id"), nullable=False)
    invited_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    token: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, default=lambda: secrets.token_urlsafe(32))
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    # Relaciones
    group: Mapped["Group"] = relationship(back_populates="invitations")
    sender: Mapped["User"] = relationship(back_populates="invitations_sent")

    def serialize(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "invited_by": self.invited_by,
            "email": self.email,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
