from uuid import UUID

from app.models.plan import Plan
from app.repositories.plan_repository import PlanRepository


class PlanService:

    @staticmethod
    def get_all_plans(db):
        return PlanRepository.get_all(db)

    @staticmethod
    def get_plan_by_id(db, plan_id: UUID):
        return PlanRepository.get_by_id(db, plan_id)

    @staticmethod
    def create_plan(db, plan_data: dict):

        plan_data["status"] = "active"

        plan = Plan(**plan_data)

        return PlanRepository.create(
            db,
            plan
        )

    @staticmethod
    def update_plan(
        db,
        plan_id: UUID,
        update_data: dict
    ):

        plan = PlanRepository.get_by_id(
            db,
            plan_id
        )

        if not plan:
            return None

        for key, value in update_data.items():

            if value is not None:
                setattr(plan, key, value)

        return PlanRepository.update(
            db,
            plan
        )

    @staticmethod
    def delete_plan(
        db,
        plan_id: UUID
    ):

        plan = PlanRepository.get_by_id(
            db,
            plan_id
        )

        if not plan:
            return None

        PlanRepository.delete(
            db,
            plan
        )

        return {
            "message": "Plan deleted successfully"
        }