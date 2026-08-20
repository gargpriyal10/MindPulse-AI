"""Rename image_path to media_path in emotion_history

Revision ID: b825343094b5
Revises: 7c878d3d1755
Create Date: 2026-08-20 11:29:24.872007
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b825343094b5"
down_revision = "7c878d3d1755"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("emotion_history") as batch_op:
        batch_op.alter_column(
            "image_path",
            new_column_name="media_path",
            existing_type=sa.String(length=255),
            existing_nullable=False
        )


def downgrade():
    with op.batch_alter_table("emotion_history") as batch_op:
        batch_op.alter_column(
            "media_path",
            new_column_name="image_path",
            existing_type=sa.String(length=255),
            existing_nullable=False
        )