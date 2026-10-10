from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None)
    status: str = Field("active")
    progress: int = Field(0, ge=0, le=100)
    icon: Optional[str] = Field("📋")
    color: Optional[str] = Field("#4f46e5")
    start_date: Optional[date] = None
    deadline: Optional[date] = None


class ProjectCreate(ProjectBase):
    workspace_id: int


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    icon: Optional[str] = None
    color: Optional[str] = None
    start_date: Optional[date] = None
    deadline: Optional[date] = None
    workspace_id: Optional[int] = None


class ProjectOut(ProjectBase):
    id: int
    workspace_id: int
    created_at: datetime
    updated_at: datetime
    total_tasks: int = 0
    completed_tasks: int = 0
    team: List[str] = Field(default_factory=lambda: ["user-1"])

    model_config = ConfigDict(from_attributes=True)
