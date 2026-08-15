from uuid import UUID
from datetime import datetime

from app.core.supabase_client import supabase

from app.models.gym import Gym
from app.models.user_profile import UserProfile

from app.repositories.gym_repository import GymRepository
from app.repositories.user_profile_repository import (
    UserProfileRepository
)


class GymService:

    @staticmethod
    def get_all_gyms(db):
        return GymRepository.get_all(db)

    @staticmethod
    def get_gym_by_id(
        db,
        gym_id: UUID
    ):
        return GymRepository.get_by_id(
            db,
            gym_id
        )

    @staticmethod
    def create_gym(
        db,
        gym_data: dict
    ):

        owner_email = gym_data.pop(
            "owner_email"
        )

        owner_password = gym_data.pop(
            "owner_password"
        )

        now = datetime.utcnow()

        gym_data["status"] = "active"
        gym_data["created_at"] = now
        gym_data["updated_at"] = now

        gym_data["email"] = owner_email

        gym = Gym(**gym_data)

        gym = GymRepository.create(
            db,
            gym
        )

        response = supabase.auth.sign_up(
            {
                "email": owner_email,
                "password": owner_password
            }
        )

        auth_user = response.user

        user_profile = UserProfile(
            auth_user_id=auth_user.id,
            gym_id=gym.id,
            email=owner_email,
            role="gym_admin",
            first_name=gym.owner_name
        )

        UserProfileRepository.create(
            db,
            user_profile
        )

        return {
            "gym_id": str(gym.id),
            "gym_name": gym.name,
            "gym_admin_email": owner_email,
            "role": "gym_admin"
        }

    @staticmethod
    def update_gym(
        db,
        gym,
        update_data: dict
    ):
        for key, value in update_data.items():

            if value is not None:
                setattr(
                    gym,
                    key,
                    value
                )

        gym.updated_at = datetime.utcnow()

        return GymRepository.update(
            db,
            gym
        )

    @staticmethod
    def delete_gym(
        db,
        gym: Gym
    ):
        return GymRepository.delete(
            db,
            gym
        )

    @staticmethod
    def assign_admin(
        db,
        gym_id: UUID,
        user_profile_id: UUID
    ):

        gym = GymRepository.get_by_id(
            db,
            gym_id
        )

        if not gym:
            return None

        user_profile = (
            UserProfileRepository.get_by_id(
                db,
                user_profile_id
            )
        )

        if not user_profile:
            return False

        user_profile.gym_id = gym_id
        user_profile.role = "gym_admin"

        UserProfileRepository.update(
            db,
            user_profile
        )

        return user_profile