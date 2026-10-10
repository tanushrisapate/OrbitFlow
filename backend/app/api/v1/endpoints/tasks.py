from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.task import Task
from app.models.project import Project
from app.models.activity import Activity
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskOut
from app.db.init_db import init_db

router = APIRouter()


def parse_id(id_str: str, prefix: str) -> int:
    """Parse string or numeric ID supporting prefixed IDs like 'task-1' or 'proj-1'."""
    clean_str = id_str.replace(prefix, "").strip()
    try:
        return int(clean_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid ID format: '{id_str}'",
        )


def update_task_completed_at(task: Task, new_status: Optional[str]) -> None:
    """Consistently apply status transition rules for completed_at timestamp:
    - Any non-done -> done: set completed_at to current UTC time.
    - done -> done (editing other fields): preserve completed_at.
    - done -> non-done: clear completed_at.
    - Reopening and completing again: record new completion time.
    """
    if new_status is None:
        return
    new_status_lower = new_status.lower()
    old_status_lower = (task.status or "").lower()

    if old_status_lower != "done" and new_status_lower == "done":
        task.completed_at = datetime.now(timezone.utc)
    elif old_status_lower == "done" and new_status_lower != "done":
        task.completed_at = None


def build_task_out(task: Task) -> TaskOut:
    """Helper to convert Task model to TaskOut schema."""
    return TaskOut(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        dueDate=task.due_date,
        project_id=task.project_id,
        assignee_id=task.assignee_id or "user-1",
        assignee=task.assignee_id or "user-1",
        created_at=task.created_at,
        updated_at=task.updated_at,
        completed_at=task.completed_at,
    )


@router.get("", response_model=List[TaskOut], summary="List Tasks")
def get_tasks(
    project_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Retrieve all tasks, optionally filtered by project_id, status, or search string."""
    init_db(db)
    query = db.query(Task)

    if project_id:
        numeric_proj_id = parse_id(project_id, "proj-")
        query = query.filter(Task.project_id == numeric_proj_id)

    if status_filter and status_filter.lower() != "all":
        query = query.filter(Task.status.ilike(status_filter))

    if search:
        query = query.filter(
            (Task.title.ilike(f"%{search}%")) | (Task.description.ilike(f"%{search}%"))
        )

    tasks = query.offset(skip).limit(limit).all()
    return [build_task_out(t) for t in tasks]


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED, summary="Create Task")
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
):
    """Create a new task within a project."""
    init_db(db)
    # Verify target project exists
    project = db.query(Project).filter(Project.id == task_in.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{task_in.project_id}' not found",
        )

    completed_at_val = (
        datetime.now(timezone.utc) if task_in.status and task_in.status.lower() == "done" else None
    )
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        due_date=task_in.due_date,
        project_id=task_in.project_id,
        assignee_id=task_in.assignee_id or "user-1",
        completed_at=completed_at_val,
    )
    db.add(task)

    activity = Activity(
        user_id=task_in.assignee_id or "user-1",
        user_name="Tanushri",
        action="created task",
        target=task_in.title,
        type="task",
        project_name=project.name if project else "DevTrack",
        workspace_id=project.workspace_id if project else 1,
    )
    db.add(activity)

    db.commit()
    db.refresh(task)
    return build_task_out(task)


@router.get("/{task_id}", response_model=TaskOut, summary="Get Task Details")
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve task details by ID."""
    init_db(db)
    numeric_id = parse_id(task_id, "task-")
    task = db.query(Task).filter(Task.id == numeric_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )
    return build_task_out(task)


@router.put("/{task_id}", response_model=TaskOut, summary="Update Task")
def update_task(
    task_id: str,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
):
    """Update task fields by ID."""
    numeric_id = parse_id(task_id, "task-")
    task = db.query(Task).filter(Task.id == numeric_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )

    update_data = task_in.model_dump(exclude_unset=True)
    if "project_id" in update_data and update_data["project_id"] is not None:
        proj = db.query(Project).filter(Project.id == update_data["project_id"]).first()
        if not proj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Target project '{update_data['project_id']}' not found",
            )

    if "status" in update_data and update_data["status"] is not None:
        update_task_completed_at(task, update_data["status"])

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return build_task_out(task)


@router.patch("/{task_id}/status", response_model=TaskOut, summary="Update Task Workflow Status")
def update_task_status(
    task_id: str,
    status_in: TaskStatusUpdate,
    db: Session = Depends(get_db),
):
    """Update workflow status of a task (e.g., when dragging across Kanban columns)."""
    numeric_id = parse_id(task_id, "task-")
    task = db.query(Task).filter(Task.id == numeric_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )

    update_task_completed_at(task, status_in.status)
    task.status = status_in.status
    activity = Activity(
        user_id="user-1",
        user_name="Tanushri",
        action=f"moved task to {status_in.status}",
        target=task.title,
        type="status_change",
        project_name=task.project.name if task.project else "DevTrack",
        workspace_id=task.project.workspace_id if task.project else 1,
    )
    db.add(activity)
    db.commit()
    db.refresh(task)
    return build_task_out(task)


@router.delete("/{task_id}", status_code=status.HTTP_200_OK, summary="Delete Task")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
):
    """Delete a task by ID."""
    numeric_id = parse_id(task_id, "task-")
    task = db.query(Task).filter(Task.id == numeric_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )

    activity = Activity(
        user_id="user-1",
        user_name="Tanushri",
        action="deleted task",
        target=task.title,
        type="task",
        project_name=task.project.name if task.project else "DevTrack",
        workspace_id=task.project.workspace_id if task.project else 1,
    )
    db.add(activity)
    db.delete(task)
    db.commit()
    return {"message": f"Task '{task_id}' deleted successfully"}
