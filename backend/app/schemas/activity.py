from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ActivityCreate(BaseModel):
    action: str = Field(..., min_length=1)
    target: str = Field(..., min_length=1)
    detail: Optional[str] = None
    type: str = Field("create")
    project_name: Optional[str] = None
    workspace_id: Optional[int] = None
    user_id: Optional[str] = "user-1"
    user_name: Optional[str] = "Tanushri"


class ActivityOut(BaseModel):
    id: int
    user_id: str
    userId: str
    user_name: str
    action: str
    target: str
    detail: Optional[str] = None
    type: str
    project_name: Optional[str] = None
    workspace_id: Optional[int] = None
    created_at: datetime
    timestamp: str

    model_config = ConfigDict(from_attributes=True)
