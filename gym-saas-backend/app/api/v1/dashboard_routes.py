from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import (
    require_role
)

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
    current_user=Depends(require_role(["super_admin", "gym_admin","owner"])),
    db: Session = Depends(get_db)
):
    return DashboardService.get_stats(
        db,
        gym_id
    )