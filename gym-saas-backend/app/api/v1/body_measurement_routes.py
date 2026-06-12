from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.body_measurement_schema import (
    BodyMeasurementCreate,
    BodyMeasurementUpdate
)

from app.services.body_measurement_service import (
    BodyMeasurementService
)

router = APIRouter(
    prefix="/body-measurements",
    tags=["Body Measurements"]
)


@router.get("/")
def get_measurements(
    db: Session = Depends(get_db)
):
    return (
        BodyMeasurementService
        .get_all_measurements(db)
    )


@router.get("/{measurement_id}")
def get_measurement(
    measurement_id: UUID,
    db: Session = Depends(get_db)
):

    measurement = (
        BodyMeasurementService
        .get_measurement_by_id(
            db,
            measurement_id
        )
    )

    if not measurement:
        raise HTTPException(
            status_code=404,
            detail="Measurement not found"
        )

    return measurement


@router.post("/")
def create_measurement(
    measurement: BodyMeasurementCreate,
    db: Session = Depends(get_db)
):

    return (
        BodyMeasurementService
        .create_measurement(
            db,
            measurement.model_dump()
        )
    )


@router.put("/{measurement_id}")
def update_measurement(
    measurement_id: UUID,
    measurement: BodyMeasurementUpdate,
    db: Session = Depends(get_db)
):

    updated_measurement = (
        BodyMeasurementService
        .update_measurement(
            db,
            measurement_id,
            measurement.model_dump()
        )
    )

    if not updated_measurement:
        raise HTTPException(
            status_code=404,
            detail="Measurement not found"
        )

    return updated_measurement


@router.delete("/{measurement_id}")
def delete_measurement(
    measurement_id: UUID,
    db: Session = Depends(get_db)
):

    result = (
        BodyMeasurementService
        .delete_measurement(
            db,
            measurement_id
        )
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Measurement not found"
        )

    return result