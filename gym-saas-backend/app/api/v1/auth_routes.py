from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth_schema import RegisterRequest, LoginRequest, UserResponse, LoginResponse
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

security = HTTPBearer()


@router.post(
    "/register",
    status_code=201,
    summary="Create new user account"
)
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        return AuthService.register(db, user.model_dump())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Authenticate user"
)
def login(
    user: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        return AuthService.login_with_profile(db, user.email, user.password)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user"
)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    return AuthService.get_current_user(db, token)