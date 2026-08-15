from fastapi import HTTPException

from app.core.supabase_client import supabase
from app.models.user_profile import UserProfile
from app.repositories.user_profile_repository import (
    UserProfileRepository
)


class AuthService:

    @staticmethod
    def register(
        db,
        user_data: dict
    ):

        response = supabase.auth.sign_up(
            {
                "email": user_data["email"],
                "password": user_data["password"]
            }
        )

        auth_user = response.user

        user_profile = UserProfile(
            auth_user_id=auth_user.id,
            email=user_data["email"],
            role=user_data["role"],
            first_name=user_data.get("first_name"),
            last_name=user_data.get("last_name")
        )

        UserProfileRepository.create(
            db,
            user_profile
        )

        return response

    @staticmethod
    def login(
        email: str,
        password: str
    ):

        response = supabase.auth.sign_in_with_password(
            {
                "email": email,
                "password": password
            }
        )

        return response

    @staticmethod
    def get_current_user(
        db,
        token: str
    ):

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
                detail="User profile not found"
            )

        return {
            "id": str(user_profile.id),
            "auth_user_id": str(
                user_profile.auth_user_id
            ),
            "email": user_profile.email,
            "role": user_profile.role,
            "gym_id": (
                str(user_profile.gym_id)
                if user_profile.gym_id
                else None
            )
        }