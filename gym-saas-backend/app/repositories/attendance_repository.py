from uuid import UUID

from sqlalchemy.orm import Session

from app.models.attendance import Attendance


class AttendanceRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Attendance).all()

    @staticmethod
    def get_by_id(
        db: Session,
        attendance_id: UUID
    ):
        return (
            db.query(Attendance)
            .filter(
                Attendance.id == attendance_id
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        attendance: Attendance
    ):
        db.add(attendance)

        db.commit()

        db.refresh(attendance)

        return attendance

    @staticmethod
    def update(
        db: Session,
        attendance: Attendance
    ):
        db.commit()

        db.refresh(attendance)

        return attendance