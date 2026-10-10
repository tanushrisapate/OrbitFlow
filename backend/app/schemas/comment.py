from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1)
    user_id: Optional[str] = "user-1"
    user_name: Optional[str] = "Tanushri"


class CommentOut(BaseModel):
    id: int
    task_id: int
    user_id: str
    user_name: str
    userId: Optional[str] = None
    content: str
    text: str
    createdAt: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
