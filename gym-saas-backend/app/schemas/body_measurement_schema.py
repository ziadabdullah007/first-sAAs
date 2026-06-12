from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class BodyMeasurementCreate(BaseModel):
    member_id: UUID

    weight: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    bmi: Optional[float] = None
    notes: Optional[str] = None


class BodyMeasurementUpdate(BaseModel):
    weight: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    bmi: Optional[float] = None
    notes: Optional[str] = None


class BodyMeasurementResponse(BaseModel):
    id: UUID
    member_id: UUID

    measured_at: datetime

    weight: Optional[float]
    body_fat_percentage: Optional[float]
    bmi: Optional[float]

    notes: Optional[str]

    model_config = {
        "from_attributes": True
    }