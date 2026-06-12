from datetime import datetime
from uuid import UUID

from app.models.attendance import Attendance
from app.repositories.attendance_repository import (
    AttendanceRepository
)


class AttendanceService:

    @staticmethod
    def get_all_attendance(db):
        return AttendanceRepository.get_all(db)

    @staticmethod
    def get_attendance_by_id(
        db,
        attendance_id: UUID
    ):
        return AttendanceRepository.get_by_id(
            db,
            attendance_id
        )

    @staticmethod
    def check_in(
        db,
        attendance_data: dict
    ):

        attendance = Attendance(
            member_id=attendance_data["member_id"],
            gym_id=attendance_data["gym_id"],
            check_in_time=datetime.utcnow(),
            check_out_time=None
        )

        return AttendanceRepository.create(
            db,
            attendance
        )

    @staticmethod
    def check_out(
        db,
        attendance_id: UUID
    ):

        attendance = (
            AttendanceRepository.get_by_id(
                db,
                attendance_id
            )
        )

        if not attendance:
            return None

        attendance.check_out_time = (
            datetime.utcnow()
        )

        return AttendanceRepository.update(
            db,
            attendance
        )