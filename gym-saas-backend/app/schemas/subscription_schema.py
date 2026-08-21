from pydantic import BaseModel, field_validator
from typing import Optional
from uuid import UUID
from datetime import date


class SubscriptionCreate(BaseModel):
    member_id: UUID
    plan_id: UUID

    start_date: date
    end_date: date

    amount: float

    auto_renew: bool = False

    @field_validator('end_date')
    @classmethod
    def end_date_must_be_after_start(cls, v, info):
        start = info.data.get('start_date')
        if start and v <= start:
            raise ValueError('End date must be after start date')
        return v

    @field_validator('amount')
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return round(v, 2)


class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    auto_renew: Optional[bool] = None


class SubscriptionResponse(BaseModel):
    id: UUID
    member_id: UUID
    plan_id: UUID
    start_date: date
    end_date: date
    status: str
    amount: float
    auto_renew: bool
    model_config = {"from_attributes": True}