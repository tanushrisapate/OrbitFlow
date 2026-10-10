"""add_completed_at_to_tasks

Revision ID: b3f901c8e4d2
Revises: 09737c7104ad
Create Date: 2026-10-11 00:05:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b3f901c8e4d2'
down_revision: Union[str, None] = '09737c7104ad'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add nullable completed_at column to tasks table
    op.add_column('tasks', sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True))
    op.create_index(op.f('ix_tasks_completed_at'), 'tasks', ['completed_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_tasks_completed_at'), table_name='tasks')
    op.drop_column('tasks', 'completed_at')
