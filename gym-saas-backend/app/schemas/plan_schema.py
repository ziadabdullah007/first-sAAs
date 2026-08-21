from pydantic import BaseModel, Field, field_validator
from typing import Optional
from uuid import UUID


class PlanCreate(BaseModel):
    gym_id: UUID
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    duration_months: int = Field(..., ge=1, le=120)

    @field_validator('price')
    @classmethod
    def validate_price(cls, v):
        if v < 0:
            raise ValueError('Price must be non-negative')
        return round(v, 2)


class PlanUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    duration_months: Optional[int] = Field(None, ge=1, le=120)
    status: Optional[str] = Field(None, max_length=50)


class PlanResponse(BaseModel):
    id: UUID
    gym_id: UUID
    name: str
    description: Optional[str]
    price: float
    duration_months: int
    status: str
    model_config = {"from_attributes": True}