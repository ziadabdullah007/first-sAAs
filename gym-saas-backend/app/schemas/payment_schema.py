from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class PaymentCreate(BaseModel):
    subscription_id: UUID
    member_id: UUID

    amount: float

    payment_method: str


class PaymentUpdate(BaseModel):
    payment_method: Optional[str] = None
    status: Optional[str] = None


class PaymentResponse(BaseModel):
    id: UUID

    subscription_id: UUID
    member_id: UUID

    amount: float

    payment_method: str

    status: str

    payment_date: datetime

    model_config = {
        "from_attributes": True
    }