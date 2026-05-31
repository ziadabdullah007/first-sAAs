from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
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