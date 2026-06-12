from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import date, datetime


class MemberCreate(BaseModel):
    gym_id: UUID
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: str
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None


class MemberResponse(BaseModel):
    id: UUID
    gym_id: UUID

    first_name: str
    last_name: str

    email: Optional[str]
    phone: str

    date_of_birth: Optional[date]
    gender: Optional[str]

    status: str

    joined_at: datetime

    model_config = {
        "from_attributes": True
    }

class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None


    