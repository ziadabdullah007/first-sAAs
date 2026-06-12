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
            first_name=user_data.get(
                "first_name"
            ),
            last_name=user_data.get(
                "last_name"
            )
        )

        UserProfileRepository.create(
            db,
            user_profile
        )

        return response