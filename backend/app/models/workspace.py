from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base

if TYPE_CHECKING:
    from app.models.project import Project


class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True, default="🚀")
    color: Mapped[str | None] = mapped_column(String(50), nullable=True, default="#6366f1")
    
    # Temporary ownership assumption until Phase 8 (Auth)
    owner_id: Mapped[str | None] = mapped_column(String(50), nullable=True, default="user-1")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationship to projects
    projects: Mapped[List["Project"]] = relationship(
        "Project", back_populates="workspace", cascade="all, delete-orphan"
    )
