from datetime import datetime, date
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base

if TYPE_CHECKING:
    from app.models.project import Project


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Workflow status: 'todo', 'in-progress', 'in-review', 'done'
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="todo", index=True)
    
    # Priority: 'low', 'medium', 'high', 'urgent'
    priority: Mapped[str] = mapped_column(String(50), nullable=False, default="medium", index=True)
    
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Foreign key relationship to projects
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Temporary identity assignment until Phase 8 (Auth)
    assignee_id: Mapped[str | None] = mapped_column(String(50), nullable=True, default="user-1")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )

    # Relationship to project
    project: Mapped["Project"] = relationship("Project", back_populates="tasks")
