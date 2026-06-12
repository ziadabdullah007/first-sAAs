from pydantic import BaseModel
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

    model_config = {
        "from_attributes": True
    }