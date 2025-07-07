"""description added

Revision ID: 927b3a39d19a
Revises: 
Create Date: 2025-03-08 02:45:05.829710

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '927b3a39d19a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
        op.add_column('users', sa.Column('two_factor_enabled', sa.Boolean(), nullable=True))
   #pass

def downgrade() -> None:
    #op.drop_column("notifications","sent_at")
    pass
