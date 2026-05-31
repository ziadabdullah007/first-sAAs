import uuid

from datetime import date

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class GymSubscription(Base):
    __tablename__ = "gym_subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    gym_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gyms.id")
    )

    saas_plan_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("saas_plans.id")
    )

    start_date: Mapped[date]

    end_date: Mapped[date]

    status: Mapped[str] = mapped_column(
        String(50)
    )