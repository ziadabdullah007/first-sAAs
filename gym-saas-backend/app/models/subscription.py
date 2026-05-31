import uuid
from sqlalchemy.orm import relationship
from datetime import date

from sqlalchemy import ForeignKey, Date, Numeric, Boolean, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )
    member = relationship(
        "Member",
        back_populates="subscriptions"
    )

    plan = relationship(
        "Plan",
        back_populates="subscriptions"
    )

    payments = relationship(
        "Payment",
        back_populates="subscription"
    
    )
    
    member_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("members.id")
    )

    plan_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("plans.id")
    )

    start_date: Mapped[date] = mapped_column(Date)

    end_date: Mapped[date] = mapped_column(Date)

    status: Mapped[str] = mapped_column(
        String(50)
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2)
    )

    auto_renew: Mapped[bool] = mapped_column(
        Boolean
    )