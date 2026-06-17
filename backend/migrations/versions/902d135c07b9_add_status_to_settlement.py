"""add status to settlement

Revision ID: 902d135c07b9
Revises: f956aae3e920
Create Date: 2026-06-17 19:49:51.364557

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '902d135c07b9'
down_revision = 'f956aae3e920'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('settlement', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'))

def downgrade():
    with op.batch_alter_table('settlement', schema=None) as batch_op:
        batch_op.drop_column('status')
