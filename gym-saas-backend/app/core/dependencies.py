from typing import Callable

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.supabase_client import supabase
from app.db.database import get_db
from app.repositories.user_profile_repository import UserProfileRepository

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Validate JWT token via Supabase and return the user profile."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials

    try:
        response = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not response.user:
        raise HTTPException(status_code=401, detail="Invalid token")

    auth_user = response.user

    user_profile = UserProfileRepository.get_by_auth_user_id(db, auth_user.id)

    if not user_profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    return user_profile


def require_role(allowed_roles: list[str]) -> Callable:
    """Dependency factory that checks the current user has one of the allowed roles."""
    def role_checker(
        current_user=Depends(get_current_user),
    ):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker