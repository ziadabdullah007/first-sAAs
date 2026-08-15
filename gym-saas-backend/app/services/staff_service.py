from datetime import datetime

from app.core.supabase_client import supabase

from app.models.staff import Staff
from app.models.user_profile import UserProfile

from app.repositories.staff_repository import (
    StaffRepository
)

from app.repositories.user_profile_repository import (
    UserProfileRepository
)


class StaffService:

    @staticmethod
    def create_staff(
        db,
        gym_id,
        staff_data: dict
    ):

        response = supabase.auth.sign_up(
            {
                "email": staff_data["email"],
                "password": staff_data["password"]
            }
        )

        auth_user = response.user

        user_profile = UserProfile(
            auth_user_id=auth_user.id,
            gym_id=gym_id,
            role=staff_data["position"],
            email=staff_data["email"],
            first_name=staff_data["first_name"],
            last_name=staff_data.get(
                "last_name"
            )
        )

        user_profile = (
            UserProfileRepository.create(
                db,
                user_profile
            )
        )

        staff = Staff(
            gym_id=gym_id,
            user_profile_id=user_profile.id,
            position=staff_data["position"],
            status="active",
            created_at=datetime.utcnow()
        )

        return StaffRepository.create(
            db,
            staff
        )

    @staticmethod
    def get_all_staff(
        db
    ):
        return StaffRepository.get_all(
            db
        )