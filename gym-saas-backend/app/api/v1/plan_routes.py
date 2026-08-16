from uuid import UUID
from app.core.dependencies import (
    require_role
)
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from app.core.dependencies import get_current_user
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.plan_schema import (
    PlanCreate,
    PlanUpdate
)

from app.services.plan_service import (
    PlanService
)

router = APIRouter(
    prefix="/plans",
    tags=["Plans"]
)


@router.get("/")
def get_plans(
    db: Session = Depends(get_db),
    current_user = Depends( require_role ( ["gym_admin"]))

):
    return PlanService.get_all_plans(db)


@router.get("/{plan_id}")
def get_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
        current_user = Depends( require_role ( ["gym_admin"]))

):

    plan = PlanService.get_plan_by_id(
        db,
        plan_id
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return plan


@router.post("/")
def create_plan(
    plan: PlanCreate,
    db: Session = Depends(get_db),
        current_user = Depends( require_role ( ["gym_admin"]))

):

    return PlanService.create_plan(
        db,
        plan.model_dump()
    )


@router.put("/{plan_id}")
def update_plan(
    plan_id: UUID,
    plan: PlanUpdate,
    db: Session = Depends(get_db),
       current_user = Depends( require_role ( ["gym_admin"]))

):

    updated_plan = PlanService.update_plan(
        db,
        plan_id,
        plan.model_dump()
    )

    if not updated_plan:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return updated_plan


@router.delete("/{plan_id}")
def delete_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends( require_role ( ["gym_admin"]))
    
):

    result = PlanService.delete_plan(
        db,
        plan_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return result