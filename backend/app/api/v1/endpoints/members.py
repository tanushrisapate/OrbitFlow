from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.member import Member
from app.models.activity import Activity
from app.models.workspace import Workspace
from app.schemas.member import MemberInvite, MemberRoleUpdate, MemberOut
from app.db.init_db import init_db

router = APIRouter()


def build_member_out(m: Member) -> MemberOut:
    """Helper to convert Member model to MemberOut schema."""
    return MemberOut(
        id=m.id,
        user_id=m.user_id,
        workspace_id=m.workspace_id,
        name=m.name,
        email=m.email,
        role=m.role,
        status=m.status,
        tasks_count=m.tasks_count,
        tasksCount=m.tasks_count,
        created_at=m.created_at,
    )


@router.get("", response_model=List[MemberOut], summary="List Members")
def get_members(
    workspace_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve workspace team members."""
    init_db(db)
    query = db.query(Member)
    if workspace_id:
        clean_ws_id = int(str(workspace_id).replace("ws-", "").strip())
        query = query.filter(Member.workspace_id == clean_ws_id)

    members = query.all()
    return [build_member_out(m) for m in members]


@router.post("/invite", response_model=MemberOut, status_code=status.HTTP_201_CREATED, summary="Invite Team Member")
def invite_member(
    invite_in: MemberInvite,
    db: Session = Depends(get_db),
):
    """Invite a new member to a workspace (development mock identity)."""
    init_db(db)
    ws_id = invite_in.workspace_id or 1
    ws = db.query(Workspace).filter(Workspace.id == ws_id).first()
    if not ws:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace '{ws_id}' not found",
        )

    # Generate user_id based on email or count
    clean_name = invite_in.name or invite_in.email.split("@")[0].capitalize()
    generated_id = f"user-{db.query(Member).count() + 1}"

    member = Member(
        workspace_id=ws_id,
        user_id=generated_id,
        name=clean_name,
        email=invite_in.email,
        role=invite_in.role or "Member",
        status="online",
        tasks_count=0,
    )
    db.add(member)

    # Log activity record
    activity = Activity(
        user_id="user-1",
        user_name="Tanushri",
        action="invited",
        target=invite_in.email,
        detail=f"as {invite_in.role}",
        type="join",
        project_name=ws.name,
        workspace_id=ws_id,
    )
    db.add(activity)

    db.commit()
    db.refresh(member)
    return build_member_out(member)


@router.put("/{user_id}/role", response_model=MemberOut, summary="Update Member Role")
def update_member_role(
    user_id: str,
    role_in: MemberRoleUpdate,
    db: Session = Depends(get_db),
):
    """Update role for a member in a workspace."""
    init_db(db)
    ws_id = role_in.workspace_id or 1
    member = db.query(Member).filter(
        (Member.user_id == user_id) | (Member.email == user_id),
        Member.workspace_id == ws_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member '{user_id}' not found in workspace '{ws_id}'",
        )

    member.role = role_in.role
    db.commit()
    db.refresh(member)
    return build_member_out(member)


@router.delete("/{user_id}", status_code=status.HTTP_200_OK, summary="Remove Member")
def remove_member(
    user_id: str,
    workspace_id: Optional[str] = Query("1"),
    db: Session = Depends(get_db),
):
    """Remove a member from a workspace."""
    init_db(db)
    clean_ws_id = int(str(workspace_id).replace("ws-", "").strip())
    member = db.query(Member).filter(
        (Member.user_id == user_id) | (Member.email == user_id),
        Member.workspace_id == clean_ws_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member '{user_id}' not found in workspace '{clean_ws_id}'",
        )

    db.delete(member)
    db.commit()
    return {"message": f"Member '{user_id}' removed from workspace successfully"}
