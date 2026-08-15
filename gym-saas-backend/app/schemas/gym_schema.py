from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional


class GymCreate(BaseModel):
    name: str

    owner_name: str

    owner_email: EmailStr

    owner_password: str

    phone: Optional[str] = None

    address: Optional[str] = None


class GymUpdate(BaseModel):
    name: Optional[str] = None
    owner_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None


class GymResponse(BaseModel):
    id: UUID

    name: str
    owner_name: str
    email: str

    phone: Optional[str]
    address: Optional[str]

    status: str

    model_config = {
        "from_attributes": True
    }


class AssignAdminRequest(BaseModel):
    user_profile_id: UUID