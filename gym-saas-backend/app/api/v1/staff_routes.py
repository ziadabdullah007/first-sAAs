from uuid import UUID

from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.staff_schema import (
    StaffCreate
)

from app.services.staff_service import (
    StaffService
)

from app.core.dependencies import (
    require_role
)

router = APIRouter(
    prefix="/staff",
    tags=["Staff"]
)


@router.post("/{gym_id}")
def create_staff(
    gym_id: UUID,
    staff: StaffCreate,
    current_user=Depends(
        require_role(
            [
                "super_admin",
                "gym_admin"
            ]
        )
    ),
    db: Session = Depends(get_db)
):

    return StaffService.create_staff(
        db,
        gym_id,
        staff.model_dump()
    )


@router.get("/")
def get_staff(
    current_user=Depends(
        require_role(
            [
                "super_admin",
                "gym_admin"
            ]
        )
    ),
    db: Session = Depends(get_db)
):

    return StaffService.get_all_staff(
        db
    )