from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.activity import Activity
from app.schemas.activity import ActivityOut
from app.db.init_db import init_db

router = APIRouter()


def build_activity_out(act: Activity) -> ActivityOut:
    """Helper to convert Activity model to ActivityOut schema."""
    # Format user-friendly timestamp
    ts_str = act.created_at.strftime("%Y-%m-%d %H:%M") if act.created_at else "Just now"
    return ActivityOut(
        id=act.id,
        user_id=act.user_id,
        userId=act.user_id,
        user_name=act.user_name,
        action=act.action,
        target=act.target,
        detail=act.detail,
        type=act.type or "create",
        project_name=act.project_name,
        workspace_id=act.workspace_id,
        created_at=act.created_at,
        timestamp=ts_str,
    )


@router.get("", response_model=List[ActivityOut], summary="List Activity Feed")
def get_activities(
    workspace_id: Optional[int] = None,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Retrieve recent activity logs across workspaces or specific workspace."""
    init_db(db)
    query = db.query(Activity)
    if workspace_id:
        query = query.filter(Activity.workspace_id == workspace_id)

    activities = query.order_by(Activity.created_at.desc()).limit(limit).all()
    return [build_activity_out(a) for a in activities]
