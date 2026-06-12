from uuid import UUID

from sqlalchemy.orm import Session

from app.models.subscription import Subscription


class SubscriptionRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Subscription).all()

    @staticmethod
    def get_by_id(db: Session, subscription_id: UUID):
        return (
            db.query(Subscription)
            .filter(
                Subscription.id == subscription_id
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        subscription: Subscription
    ):
        db.add(subscription)

        db.commit()

        db.refresh(subscription)

        return subscription

    @staticmethod
    def update(
        db: Session,
        subscription: Subscription
    ):
        db.commit()

        db.refresh(subscription)

        return subscription

    @staticmethod
    def delete(
        db: Session,
        subscription: Subscription
    ):
        db.delete(subscription)

        db.commit()