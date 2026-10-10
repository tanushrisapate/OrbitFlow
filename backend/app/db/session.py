from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Create SQLAlchemy Engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Ensures connection validity before executing queries
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG,
)

# Create SessionLocal class for instantiating database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """Dependency generator for FastAPI routes to obtain a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
