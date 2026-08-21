from pydantic import BaseModel, Field, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime


class BodyMeasurementCreate(BaseModel):
    member_id: UUID

    weight: Optional[float] = Field(None, gt=0)
    body_fat_percentage: Optional[float] = Field(None, ge=0, le=100)
    bmi: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = Field(None, max_length=500)

    @field_validator('weight', 'body_fat_percentage', 'bmi')
    @classmethod
    def validate_non_negative(cls, v):
        if v is not None and v < 0:
            raise ValueError('Value cannot be negative')
        return round(v, 2) if v is not None else v


class BodyMeasurementUpdate(BaseModel):
    weight: Optional[float] = Field(None, gt=0)
    body_fat_percentage: Optional[float] = Field(None, ge=0, le=100)
    bmi: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = Field(None, max_length=500)


class BodyMeasurementResponse(BaseModel):
    id: UUID
    member_id: UUID
    measured_at: datetime
    weight: Optional[float]
    body_fat_percentage: Optional[float]
    bmi: Optional[float]
    notes: Optional[str]
    model_config = {"from_attributes": True}