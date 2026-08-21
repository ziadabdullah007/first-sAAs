from uuid import UUID
from app.core.dependencies import require_role, get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.member_schema import (
    MemberCreate,
    MemberUpdate
)
from app.services.member_service import MemberService


router = APIRouter(
    prefix="/members",
    tags=["Members"]
)


@router.get("/")
def get_members(
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["super_admin", "gym_admin"])),
    role_checker = Depends(require_role(["super_admin", "gym_admin"]))
):
    # Super_admin has full access, gym_admin restricted to current gym
    if current_user.role == "gym_admin":
        return MemberService.get_all_members(
            db,
            gym_id=current_user.gym_id
        )
    return MemberService.get_all_members(db)


@router.get("/{member_id}")
def get_member(
    member_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin"])),
    role_checker = Depends(require_role(["gym_admin"]))
):
    if current_user.role == "gym_admin":
        return MemberService.get_member_by_id(
            db,
            member_id,
            gym_id=current_user.gym_id
        )
    raise HTTPException(403, "Access denied")


@router.post("/")
def create_member(
    member: MemberCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin", "staff", "owner"]))
):
    return MemberService.create_member(
        db,
        member.model_dump(),
        gym_id=current_user.gym_id
    )


@router.put("/{member_id}")
def update_member(
    member_id: UUID,
    member: MemberUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin", "staff"]))
):
    updated = MemberService.update_member(
        db,
        member_id,
        member.model_dump(),
        gym_id=current_user.gym_id
    )
    if not updated:
        raise HTTPException(404, "Member not found")
    return updated


@router.delete("/{member_id}")
def delete_member(
    member_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin", "staff"]))
):
    result = MemberService.delete_member_by_id(
        db,
        member_id,
        gym_id=current_user.gym_id
    )
    if not result:
        raise HTTPException(404, "Member not found")
    return result