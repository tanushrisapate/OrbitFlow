from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import Project
from app.models.workspace import Workspace
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from app.db.init_db import init_db

router = APIRouter()


def parse_id(id_str: str, prefix: str) -> int:
    """Parse string or numeric ID supporting prefixed string IDs like 'proj-1' or 'ws-1'."""
    clean_str = id_str.replace(prefix, "").strip()
    try:
        return int(clean_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid ID format: '{id_str}'",
        )


def build_project_out(project: Project) -> ProjectOut:
    """Helper to convert Project model to ProjectOut schema."""
    tasks = project.tasks if project.tasks is not None else []
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "done")
    return ProjectOut(
        id=project.id,
        name=project.name,
        description=project.description,
        workspace_id=project.workspace_id,
        status=project.status or "active",
        progress=project.progress or 0,
        icon=project.icon or "📋",
        color=project.color or "#4f46e5",
        start_date=project.start_date,
        deadline=project.deadline,
        created_at=project.created_at,
        updated_at=project.updated_at,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        team=["user-1"],
    )


@router.get("", response_model=List[ProjectOut], summary="List Projects")
def get_projects(
    workspace_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Retrieve all projects, optionally filtered by workspace_id, status, or search string."""
    init_db(db)
    query = db.query(Project)

    if workspace_id:
        numeric_ws_id = parse_id(workspace_id, "ws-")
        query = query.filter(Project.workspace_id == numeric_ws_id)

    if status_filter and status_filter.lower() != "all":
        query = query.filter(Project.status.ilike(status_filter))

    if search:
        query = query.filter(
            (Project.name.ilike(f"%{search}%")) | (Project.description.ilike(f"%{search}%"))
        )

    projects = query.offset(skip).limit(limit).all()
    return [build_project_out(p) for p in projects]


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED, summary="Create Project")
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
):
    """Create a new project within a workspace."""
    init_db(db)
    # Verify workspace exists
    workspace = db.query(Workspace).filter(Workspace.id == project_in.workspace_id).first()
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace with ID '{project_in.workspace_id}' does not exist",
        )

    project = Project(
        name=project_in.name,
        description=project_in.description,
        workspace_id=project_in.workspace_id,
        status=project_in.status or "active",
        progress=project_in.progress or 0,
        icon=project_in.icon or "📋",
        color=project_in.color or "#4f46e5",
        start_date=project_in.start_date,
        deadline=project_in.deadline,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return build_project_out(project)


@router.get("/{project_id}", response_model=ProjectOut, summary="Get Project by ID")
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve project details by ID."""
    init_db(db)
    numeric_id = parse_id(project_id, "proj-")
    project = db.query(Project).filter(Project.id == numeric_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )
    return build_project_out(project)


@router.put("/{project_id}", response_model=ProjectOut, summary="Update Project")
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
):
    """Update project details by ID."""
    numeric_id = parse_id(project_id, "proj-")
    project = db.query(Project).filter(Project.id == numeric_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )

    update_data = project_in.model_dump(exclude_unset=True)
    if "workspace_id" in update_data and update_data["workspace_id"] is not None:
        ws = db.query(Workspace).filter(Workspace.id == update_data["workspace_id"]).first()
        if not ws:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Target workspace '{update_data['workspace_id']}' not found",
            )

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return build_project_out(project)


@router.delete("/{project_id}", status_code=status.HTTP_200_OK, summary="Delete Project")
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
):
    """Delete a project by ID."""
    numeric_id = parse_id(project_id, "proj-")
    project = db.query(Project).filter(Project.id == numeric_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )

    db.delete(project)
    db.commit()
    return {"message": f"Project '{project_id}' deleted successfully"}
