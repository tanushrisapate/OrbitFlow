from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class MemberInvite(BaseModel):
    email: str = Field(..., min_length=3)
    workspace_id: Optional[int] = Field(1)
    role: str = Field("Member")
    name: Optional[str] = None


class MemberRoleUpdate(BaseModel):
    workspace_id: Optional[int] = Field(1)
    role: str = Field(...)


class MemberOut(BaseModel):
    id: int
    user_id: str
    workspace_id: int
    name: str
    email: str
    role: str
    status: str
    tasks_count: int
    tasksCount: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
