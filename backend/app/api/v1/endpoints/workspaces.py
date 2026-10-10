from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.project import Project
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate, WorkspaceOut
from app.db.init_db import init_db

router = APIRouter()


def parse_workspace_id(workspace_id: str) -> int:
    """Parse workspace ID supporting both string prefixes like 'ws-1' and integer string '1'."""
    clean_str = workspace_id.replace("ws-", "").strip()
    try:
        return int(clean_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid workspace ID format: '{workspace_id}'",
        )


def build_workspace_out(ws: Workspace) -> WorkspaceOut:
    """Helper to convert Workspace model to WorkspaceOut schema with computed counts."""
    projects_count = len(ws.projects) if ws.projects is not None else 0
    return WorkspaceOut(
        id=ws.id,
        name=ws.name,
        description=ws.description,
        icon=ws.icon or "🚀",
        color=ws.color or "#6366f1",
        owner_id=ws.owner_id or "user-1",
        created_at=ws.created_at,
        updated_at=ws.updated_at,
        projects_count=projects_count,
        members=["user-1"],
    )


@router.get("", response_model=List[WorkspaceOut], summary="List Workspaces")
def get_workspaces(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve all workspaces with optional pagination and search filter."""
    # Ensure seed data exists if table is empty
    init_db(db)

    query = db.query(Workspace)
    if search:
        query = query.filter(Workspace.name.ilike(f"%{search}%"))

    workspaces = query.offset(skip).limit(limit).all()
    return [build_workspace_out(ws) for ws in workspaces]


@router.post("", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED, summary="Create Workspace")
def create_workspace(
    workspace_in: WorkspaceCreate,
    db: Session = Depends(get_db),
):
    """Create a new workspace."""
    workspace = Workspace(
        name=workspace_in.name,
        description=workspace_in.description,
        icon=workspace_in.icon or "🚀",
        color=workspace_in.color or "#6366f1",
        owner_id="user-1",  # Temporary ownership assumption until Phase 8
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return build_workspace_out(workspace)


@router.get("/{workspace_id}", response_model=WorkspaceOut, summary="Get Workspace by ID")
def get_workspace(
    workspace_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve details for a specific workspace by ID."""
    init_db(db)
    numeric_id = parse_workspace_id(workspace_id)
    workspace = db.query(Workspace).filter(Workspace.id == numeric_id).first()
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace with ID '{workspace_id}' not found",
        )
    return build_workspace_out(workspace)


@router.put("/{workspace_id}", response_model=WorkspaceOut, summary="Update Workspace")
def update_workspace(
    workspace_id: str,
    workspace_in: WorkspaceUpdate,
    db: Session = Depends(get_db),
):
    """Update workspace details by ID."""
    numeric_id = parse_workspace_id(workspace_id)
    workspace = db.query(Workspace).filter(Workspace.id == numeric_id).first()
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace with ID '{workspace_id}' not found",
        )

    update_data = workspace_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(workspace, field, value)

    db.commit()
    db.refresh(workspace)
    return build_workspace_out(workspace)


@router.delete("/{workspace_id}", status_code=status.HTTP_200_OK, summary="Delete Workspace")
def delete_workspace(
    workspace_id: str,
    db: Session = Depends(get_db),
):
    """Delete a workspace by ID."""
    numeric_id = parse_workspace_id(workspace_id)
    workspace = db.query(Workspace).filter(Workspace.id == numeric_id).first()
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace with ID '{workspace_id}' not found",
        )

    db.delete(workspace)
    db.commit()
    return {"message": f"Workspace '{workspace_id}' deleted successfully"}
