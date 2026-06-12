from uuid import UUID

from sqlalchemy.orm import Session

from app.models.gym import Gym


class GymRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Gym).all()

    @staticmethod
    def get_by_id(
        db: Session,
        gym_id: UUID
    ):
        return (
            db.query(Gym)
            .filter(Gym.id == gym_id)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        gym: Gym
    ):
        db.add(gym)

        db.commit()

        db.refresh(gym)

        return gym

    @staticmethod
    def update(
        db: Session,
        gym: Gym
    ):
        db.commit()

        db.refresh(gym)

        return gym

    @staticmethod
    def delete(
        db: Session,
        gym: Gym
    ):
        db.delete(gym)

        db.commit()
        