from pydantic import BaseModel, Field, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime


class PaymentCreate(BaseModel):
    subscription_id: UUID
    member_id: UUID

    amount: float = Field(..., gt=0)

    payment_method: str = Field(..., min_length=1, max_length=50)

    @field_validator('amount')
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return round(v, 2)


class PaymentUpdate(BaseModel):
    payment_method: Optional[str] = Field(None, max_length=50)
    status: Optional[str] = Field(None, max_length=50)


class PaymentResponse(BaseModel):
    id: UUID
    subscription_id: UUID
    member_id: UUID
    amount: float
    payment_method: str
    status: str
    payment_date: datetime
    model_config = {"from_attributes": True}