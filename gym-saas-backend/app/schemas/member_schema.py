from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from uuid import UUID
from datetime import date, datetime


class MemberCreate(BaseModel):
    gym_id: UUID
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=1, max_length=50)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field("active", max_length=50)

    @validator('date_of_birth')
    def validate_dob(cls, v):
        if v is not None and v > date.today():
            raise ValueError('Date of birth cannot be in the future')
        return v


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
    model_config = {"from_attributes": True}


class MemberUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    gender: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, max_length=50)