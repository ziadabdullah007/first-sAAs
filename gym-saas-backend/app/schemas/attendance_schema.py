from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class AttendanceCheckIn(BaseModel):
    member_id: UUID


class AttendanceCheckOut(BaseModel):
    attendance_id: UUID


class AttendanceResponse(BaseModel):
    id: UUID
    member_id: UUID
    gym_id: UUID
    check_in_time: datetime
    check_out_time: Optional[datetime]
    model_config = {"from_attributes": True}