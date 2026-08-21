from uuid import UUID

from sqlalchemy.orm import Session

from app.models.plan import Plan


class PlanRepository:

    @staticmethod
    def get_all(
        db: Session,
        gym_id: UUID | None = None
    ):
        if gym_id:
            return db.query(Plan).filter(
                Plan.gym_id == gym_id
            ).all()
        return db.query(Plan).all()

    @staticmethod
    def get_by_id(
        db: Session,
        plan_id: UUID,
        gym_id: UUID | None = None
    ):
        query = db.query(Plan).filter(Plan.id == plan_id)
        if gym_id:
            query = query.filter(Plan.gym_id == gym_id)
        return query.first()

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