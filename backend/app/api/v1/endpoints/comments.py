from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.comment import Comment
from app.models.task import Task
from app.models.activity import Activity
from app.schemas.comment import CommentCreate, CommentOut
from app.db.init_db import init_db

router = APIRouter()


def parse_id(id_str: str, prefix: str) -> int:
    """Parse string or integer ID cleanly."""
    clean_str = id_str.replace(prefix, "").strip()
    try:
        return int(clean_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid ID format: '{id_str}'",
        )


def build_comment_out(comment: Comment) -> CommentOut:
    """Helper to convert Comment model to CommentOut schema."""
    return CommentOut(
        id=comment.id,
        task_id=comment.task_id,
        user_id=comment.user_id,
        user_name=comment.user_name,
        userId=comment.user_id,
        content=comment.content,
        text=comment.content,
        createdAt=comment.created_at,
        created_at=comment.created_at,
    )


@router.get("/tasks/{task_id}/comments", response_model=List[CommentOut], summary="List Task Comments")
@router.get("/comments", response_model=List[CommentOut], summary="List Comments Query")
def get_comments(
    task_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve all comments for a task."""
    init_db(db)
    if not task_id:
        return []
    numeric_task_id = parse_id(str(task_id), "task-")
    comments = db.query(Comment).filter(Comment.task_id == numeric_task_id).order_by(Comment.created_at.asc()).all()
    return [build_comment_out(c) for c in comments]


@router.post("/tasks/{task_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED, summary="Add Task Comment")
def create_comment(
    task_id: str,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
):
    """Add a new comment to a task and log an activity event."""
    init_db(db)
    numeric_task_id = parse_id(task_id, "task-")

    # Verify task exists
    task = db.query(Task).filter(Task.id == numeric_task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )

    comment = Comment(
        task_id=numeric_task_id,
        user_id=comment_in.user_id or "user-1",
        user_name=comment_in.user_name or "Tanushri",
        content=comment_in.content,
    )
    db.add(comment)

    # Log activity record
    activity = Activity(
        user_id=comment_in.user_id or "user-1",
        user_name=comment_in.user_name or "Tanushri",
        action="commented on",
        target=task.title,
        type="comment",
        project_name=task.project.name if task.project else "OrbitFlow",
        workspace_id=task.project.workspace_id if task.project else 1,
    )
    db.add(activity)

    db.commit()
    db.refresh(comment)
    return build_comment_out(comment)
