from uuid import UUID
from app.core.dependencies import require_role, get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.plan_schema import PlanCreate, PlanUpdate
from app.services.plan_service import PlanService


router = APIRouter(
    prefix="/plans",
    tags=["Plans"]
)


@router.get("/")
def get_plans(
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["super_admin", "gym_admin"])),
):
    if current_user.role == "gym_admin":
        return PlanService.get_all_plans(
            db,
            gym_id=current_user.gym_id
        )
    return PlanService.get_all_plans(db)


@router.get("/{plan_id}")
def get_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin"])),
):
    if current_user.role == "gym_admin":
        return PlanService.get_plan_by_id(
            db,
            plan_id,
            gym_id=current_user.gym_id
        )
    raise HTTPException(403, "Access denied")


@router.post("/")
def create_plan(
    plan: PlanCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin"]))
):
    return PlanService.create_plan(
        db,
        plan.model_dump(),
        gym_id=current_user.gym_id
    )


@router.put("/{plan_id}")
def update_plan(
    plan_id: UUID,
    plan: PlanUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin"]))
):
    updated = PlanService.update_plan(
        db,
        plan_id,
        plan.model_dump(),
        gym_id=current_user.gym_id
    )
    if not updated:
        raise HTTPException(404, "Plan not found")
    return updated


@router.delete("/{plan_id}")
def delete_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["gym_admin"]))
):
    result = PlanService.delete_plan(
        db,
        plan_id,
        gym_id=current_user.gym_id
    )
    if not result:
        raise HTTPException(404, "Plan not found")
    return result