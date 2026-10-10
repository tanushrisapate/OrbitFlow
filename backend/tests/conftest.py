import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.db.base_class import Base
from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.project import Project
from app.models.task import Task
from app.models.activity import Activity
from app.main import app

# Isolated SQLite in-memory test database URL
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Create all database tables and seed base fixtures in isolated in-memory SQLite database."""
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    try:
        ws = Workspace(
            id=1,
            name="Test Workspace",
            description="Default workspace for isolated test execution",
            icon="🚀",
            color="#6366f1",
            owner_id="user-1"
        )
        db.add(ws)
        db.commit()

        p1 = Project(
            id=1,
            name="Test Project",
            description="Default project for isolated test execution",
            workspace_id=1,
            status="active"
        )
        db.add(p1)
        db.commit()

        t1 = Task(
            id=1,
            title="Initial Test Task",
            description="Default task for test suite",
            project_id=1,
            status="todo",
            priority="medium"
        )
        db.add(t1)

        act = Activity(
            id=1,
            user_id="user-1",
            user_name="Tanushri",
            action="created task",
            target="Initial Test Task",
            type="task",
            project_name="Test Project",
            workspace_id=1
        )
        db.add(act)
        db.commit()
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


def override_get_db():
    """Dependency override to route FastAPI test client requests to isolated test database."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
