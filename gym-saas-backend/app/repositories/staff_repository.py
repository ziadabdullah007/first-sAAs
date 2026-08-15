from sqlalchemy.orm import Session

from app.models.staff import Staff


class StaffRepository:

    @staticmethod
    def create(
        db: Session,
        staff: Staff
    ):
        db.add(staff)

        db.commit()

        db.refresh(staff)

        return staff

    @staticmethod
    def get_all(
        db: Session
    ):
        return db.query(Staff).all()