from uuid import UUID

from app.models.subscription import Subscription
from app.repositories.subscription_repository import (
    SubscriptionRepository
)


class SubscriptionService:

    @staticmethod
    def get_all_subscriptions(db):
        return SubscriptionRepository.get_all(db)

    @staticmethod
    def get_subscription_by_id(
        db,
        subscription_id: UUID
    ):
        return SubscriptionRepository.get_by_id(
            db,
            subscription_id
        )

    @staticmethod
    def create_subscription(
        db,
        subscription_data: dict
    ):

        subscription_data["status"] = "active"

        subscription = Subscription(
            **subscription_data
        )

        return SubscriptionRepository.create(
            db,
            subscription
        )

    @staticmethod
    def update_subscription(
        db,
        subscription_id: UUID,
        update_data: dict
    ):

        subscription = (
            SubscriptionRepository.get_by_id(
                db,
                subscription_id
            )
        )

        if not subscription:
            return None

        for key, value in update_data.items():

            if value is not None:
                setattr(
                    subscription,
                    key,
                    value
                )

        return SubscriptionRepository.update(
            db,
            subscription
        )

    @staticmethod
    def delete_subscription(
        db,
        subscription_id: UUID
    ):

        subscription = (
            SubscriptionRepository.get_by_id(
                db,
                subscription_id
            )
        )

        if not subscription:
            return None

        SubscriptionRepository.delete(
            db,
            subscription
        )

        return {
            "message":
            "Subscription deleted successfully"
        }