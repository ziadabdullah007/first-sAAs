from uuid import UUID

from app.core.dependencies import (
    require_role
)
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.subscription_schema import (
    SubscriptionCreate,
    SubscriptionUpdate
)

from app.services.subscription_service import (
    SubscriptionService
)

router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"]
)


@router.get("/")
def get_subscriptions(
    db: Session = Depends(get_db),
    current_user = Depends( require_role ( ["gym_admin","owner"]))
):
    return (
        SubscriptionService
        .get_all_subscriptions(db)
    )


@router.get("/{subscription_id}")
def get_subscription(
    subscription_id: UUID,
    db: Session = Depends(get_db),
        current_user = Depends( require_role ( ["gym_admin","owner"]))

):

    subscription = (
        SubscriptionService
        .get_subscription_by_id(
            db,
            subscription_id
        )
    )

    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return subscription


@router.post("/")
def create_subscription(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
        current_user = Depends( require_role ( ["gym_admin","owner","staff"]))

):

    return (
        SubscriptionService
        .create_subscription(
            db,
            subscription.model_dump()
        )
    )


@router.put("/{subscription_id}")
def update_subscription(
    subscription_id: UUID,
    subscription: SubscriptionUpdate,
    db: Session = Depends(get_db),
        current_user = Depends( require_role ( ["gym_admin","owner"]))

):

    updated_subscription = (
        SubscriptionService
        .update_subscription(
            db,
            subscription_id,
            subscription.model_dump()
        )
    )

    if not updated_subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return updated_subscription


@router.delete("/{subscription_id}")
def delete_subscription(
    subscription_id: UUID,
    db: Session = Depends(get_db),
        current_user = Depends( require_role ( ["gym_admin","owner"]))

):

    result = (
        SubscriptionService
        .delete_subscription(
            db,
            subscription_id
        )
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return result