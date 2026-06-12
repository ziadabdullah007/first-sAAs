from fastapi import APIRouter

from app.schemas.auth_schema import (
    RegisterRequest
)

from app.services.auth_service import (
    AuthService
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: RegisterRequest
):

    return AuthService.register(
        user.email,
        user.password
    )