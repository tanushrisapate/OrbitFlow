from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class WorkspaceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None)
    icon: Optional[str] = Field("🚀")
    color: Optional[str] = Field("#6366f1")


class WorkspaceCreate(WorkspaceBase):
    pass


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None


class WorkspaceOut(WorkspaceBase):
    id: int
    owner_id: Optional[str] = "user-1"
    created_at: datetime
    updated_at: datetime
    projects_count: int = 0
    members: List[str] = Field(default_factory=lambda: ["user-1"])

    model_config = ConfigDict(from_attributes=True)
