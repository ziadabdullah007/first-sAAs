from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class PlanCreate(BaseModel):
    gym_id: UUID
    name: str
    description: Optional[str] = None
    price: float
    duration_months: int


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_months: Optional[int] = None
    status: Optional[str] = None


class PlanResponse(BaseModel):
    id: UUID
    gym_id: UUID

    name: str
    description: Optional[str]

    price: float
    duration_months: int

    status: str

    model_config = {
        "from_attributes": True
    }