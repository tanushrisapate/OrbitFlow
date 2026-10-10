# Import all models here for Alembic auto-generation
from app.db.base_class import Base  # noqa: F401
from app.models.workspace import Workspace  # noqa: F401
from app.models.project import Project  # noqa: F401
from app.models.task import Task  # noqa: F401
from app.models.comment import Comment  # noqa: F401
from app.models.activity import Activity  # noqa: F401
from app.models.member import Member  # noqa: F401
