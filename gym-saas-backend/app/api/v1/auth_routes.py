from fastapi import (
    APIRouter,
    Depends
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    UserResponse
)

from app.services.auth_service import (
    AuthService
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

security = HTTPBearer()


@router.post("/register")
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):

    return AuthService.register(
        db,
        user.model_dump()
    )


@router.post("/login")
def login(
    user: LoginRequest
):

    return AuthService.login(
        user.email,
        user.password
    )


@router.get(
    "/me",
    response_model=UserResponse
)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    return AuthService.get_current_user(
        db,
        token
    )


@router.get("/me")
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    print(credentials)
    print(credentials.credentials)

    token = credentials.credentials

    return AuthService.get_current_user(
        db,
        token
    )     