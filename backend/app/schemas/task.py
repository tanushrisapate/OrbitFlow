from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

VALID_STATUSES = {"todo", "in-progress", "in-review", "done"}
VALID_PRIORITIES = {"low", "medium", "high", "urgent"}


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None)
    status: str = Field("todo")
    priority: str = Field("medium")
    due_date: Optional[date] = None
    assignee_id: Optional[str] = "user-1"

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v_lower = v.lower()
        if v_lower not in VALID_STATUSES:
            raise ValueError(f"Invalid status '{v}'. Must be one of: {', '.join(VALID_STATUSES)}")
        return v_lower

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        v_lower = v.lower()
        if v_lower not in VALID_PRIORITIES:
            raise ValueError(f"Invalid priority '{v}'. Must be one of: {', '.join(VALID_PRIORITIES)}")
        return v_lower


class TaskCreate(TaskBase):
    project_id: int


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None
    assignee_id: Optional[str] = None
    project_id: Optional[int] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v_lower = v.lower()
        if v_lower not in VALID_STATUSES:
            raise ValueError(f"Invalid status '{v}'. Must be one of: {', '.join(VALID_STATUSES)}")
        return v_lower

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v_lower = v.lower()
        if v_lower not in VALID_PRIORITIES:
            raise ValueError(f"Invalid priority '{v}'. Must be one of: {', '.join(VALID_PRIORITIES)}")
        return v_lower


class TaskStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v_lower = v.lower()
        if v_lower not in VALID_STATUSES:
            raise ValueError(f"Invalid status '{v}'. Must be one of: {', '.join(VALID_STATUSES)}")
        return v_lower


class TaskOut(TaskBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    assignee: Optional[str] = "user-1"
    dueDate: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)
