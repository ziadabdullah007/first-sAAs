from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    role: str = "owner"

    first_name: str | None = None
    last_name: str | None = None