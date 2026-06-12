from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.services.dashboard_service import (
    DashboardService
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats/{gym_id}")
def get_dashboard_stats(
    gym_id: UUID,
    db: Session = Depends(get_db)
):
    return DashboardService.get_stats(
        db,
        gym_id
    )