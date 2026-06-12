from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.gym_schema import (
    GymCreate,
    GymUpdate
)

from app.services.gym_service import (
    GymService
)

router = APIRouter(
    prefix="/gyms",
    tags=["Gyms"]
)


@router.get("/")
def get_gyms(
    db: Session = Depends(get_db)
):
    return GymService.get_all_gyms(db)


@router.get("/{gym_id}")
def get_gym(
    gym_id: UUID,
    db: Session = Depends(get_db)
):
    gym = GymService.get_gym_by_id(
        db,
        gym_id
    )

    if not gym:
        raise HTTPException(
            status_code=404,
            detail="Gym not found"
        )

    return gym


@router.post("/")
def create_gym(
    gym: GymCreate,
    db: Session = Depends(get_db)
):
    return GymService.create_gym(
        db,
        gym.model_dump()
    )
@router.put("/{gym_id}")
def update_gym(
    gym_id: UUID,
    gym_data: GymUpdate,
    db: Session = Depends(get_db)
):
    gym = GymService.get_gym_by_id(
        db,
        gym_id
    )

    if not gym:
        raise HTTPException(
            status_code=404,
            detail="Gym not found"
        )

    return GymService.update_gym(
        db,
        gym,
        gym_data.model_dump()
    )

@router.delete("/{gym_id}")
def delete_gym(
    gym_id: UUID,
    db: Session = Depends(get_db)
):
    gym = GymService.get_gym_by_id(
        db,
        gym_id
    )

    if not gym:
        raise HTTPException(
            status_code=404,
            detail="Gym not found"
        )

    GymService.delete_gym(
        db,
        gym
    )

    return {
        "message": "Gym deleted successfully"
    }