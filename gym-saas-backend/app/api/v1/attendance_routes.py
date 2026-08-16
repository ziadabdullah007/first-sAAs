from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from app.core.dependencies import (
    require_role
)
from app.db.database import get_db

from app.schemas.attendance_schema import (
    AttendanceCheckIn,
    AttendanceCheckOut
)

from app.services.attendance_service import (
    AttendanceService
)

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.get("/")
def get_attendance(
    db: Session = Depends(get_db),
    current_user = Depends( require_role ( ["gym_admin","owner","staff"]))
):
    return (
        AttendanceService
        .get_all_attendance(db)
    )


@router.get("/{attendance_id}")
def get_attendance_by_id(
    attendance_id: UUID,
    db: Session = Depends(get_db),
        current_user = Depends( require_role ( ["gym_admin","owner","staff"]))

):

    attendance = (
        AttendanceService
        .get_attendance_by_id(
            db,
            attendance_id
        )
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    return attendance


@router.post("/check-in")
def check_in(
    attendance: AttendanceCheckIn,
    db: Session = Depends(get_db),
    current_user = Depends( require_role ( ["gym_admin","owner","staff"]))
):

    return (
        AttendanceService
        .check_in(
            db,
            attendance.model_dump()
        )
    )


@router.post("/check-out")
def check_out(
    attendance: AttendanceCheckOut,
    db: Session = Depends(get_db),
    current_user = Depends( require_role ( ["gym_admin","owner","staff"]))
):

    result = (
        AttendanceService
        .check_out(
            db,
            attendance.attendance_id
        )
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    return result