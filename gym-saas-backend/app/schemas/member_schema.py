from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import date


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

    model_config = {
        "from_attributes": True
    }