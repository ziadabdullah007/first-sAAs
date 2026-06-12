from uuid import UUID

from sqlalchemy.orm import Session

from app.models.plan import Plan


class PlanRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Plan).all()

    @staticmethod
    def get_by_id(db: Session, plan_id: UUID):
        return (
            db.query(Plan)
            .filter(Plan.id == plan_id)
            .first()
        )

    @staticmethod
    def create(db: Session, plan: Plan):
        db.add(plan)
        db.commit()
        db.refresh(plan)

        return plan

    @staticmethod
    def update(db: Session, plan: Plan):
        db.commit()
        db.refresh(plan)

        return plan

    @staticmethod
    def delete(db: Session, plan: Plan):
        db.delete(plan)
        db.commit()