from uuid import UUID
from datetime import datetime

from app.models.gym import Gym
from app.repositories.gym_repository import GymRepository


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
        now = datetime.utcnow()

        gym_data["status"] = "active"
        gym_data["created_at"] = now
        gym_data["updated_at"] = now

        gym = Gym(**gym_data)

        return GymRepository.create(
            db,
            gym
        )

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