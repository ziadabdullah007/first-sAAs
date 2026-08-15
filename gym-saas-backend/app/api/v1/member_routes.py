from uuid import UUID
from app.core.dependencies import get_current_user
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
    current_user = Depends(get_current_user),
    allowed_roles = ["super_admin", "gym_admin"]
):
    return MemberService.get_all_members(db)


@router.get("/{member_id}")
def get_member(
    member_id: UUID,       
db: Session = Depends(get_db),

    current_user = Depends(get_current_user),
    allowed_roles = ["gym_admin"]

):

    member = MemberService.get_member_by_id(
        db,
        member_id
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    return member


@router.post("/")
def create_member(
    member: MemberCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
        allowed_roles = ["gym_admin","staff"]
):
    return MemberService.create_member(
        db,
        member.model_dump()
    )


@router.put("/{member_id}")
def update_member(
    member_id: UUID,
    member: MemberUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    allowed_roles = ["gym_admin","staff"]
):

    updated_member = MemberService.update_member(
        db,
        member_id,
        member.model_dump()
    )

    if not updated_member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    return updated_member


@router.delete("/{member_id}")
def delete_member(
    member_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    allowed_roles = ["gym_admin","staff"]
):

    result = MemberService.delete_member_by_id(
        db,
        member_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    return result