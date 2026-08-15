from pydantic import (
    BaseModel,
    EmailStr
)


class StaffCreate(BaseModel):
    first_name: str
    last_name: str | None = None

    email: EmailStr
    password: str

    position: str