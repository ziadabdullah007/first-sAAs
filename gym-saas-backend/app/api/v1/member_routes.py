from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.member_schema import MemberCreate
from app.services.member_service import MemberService

router = APIRouter(
    prefix="/members",
    tags=["Members"]
)


@router.get("/")
def get_members(
    db: Session = Depends(get_db)
):
    return MemberService.get_all_members(db)


@router.post("/")
def create_member(
    member: MemberCreate,
    db: Session = Depends(get_db)
):
    return MemberService.create_member(
        db,
        member.model_dump()
    )