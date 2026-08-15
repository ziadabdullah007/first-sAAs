from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.supabase_client import supabase
from app.repositories.user_profile_repository import (
    UserProfileRepository
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    response = supabase.auth.get_user(
        token
    )

    auth_user = response.user

    user_profile = (
        UserProfileRepository
        .get_by_auth_user_id(
            db,
            auth_user.id
        )
    )

    if not user_profile:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user_profile

def require_role(
    allowed_roles: list
):

    def checker(
        current_user=Depends(
            get_current_user
        )
    ):

        if current_user.role not in allowed_roles:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return current_user

    return checker