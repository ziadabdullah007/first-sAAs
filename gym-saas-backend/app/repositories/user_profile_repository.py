from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user_profile import UserProfile


class UserProfileRepository:

    @staticmethod
    def create(
        db: Session,
        user_profile: UserProfile
    ):
        db.add(user_profile)
        db.commit()
        db.refresh(user_profile)
        return user_profile

    @staticmethod
    def get_by_auth_user_id(
        db: Session,
        auth_user_id
    ):
        return (
            db.query(UserProfile)
            .filter(
                UserProfile.auth_user_id == auth_user_id
            )
            .first()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: UUID
    ):
        return (
            db.query(UserProfile)
            .filter(
                UserProfile.id == user_id
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        user_profile: UserProfile
    ):
        db.commit()
        db.refresh(user_profile)
        return user_profile