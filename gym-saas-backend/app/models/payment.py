import uuid

from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Numeric, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    member = relationship(
        "Member",
        back_populates="payments"
    )

    subscription = relationship(
        "Subscription",
        back_populates="payments"
    )


    subscription_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("subscriptions.id")
    )

    member_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("members.id")
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2)
    )

    payment_method: Mapped[str] = mapped_column(
        String(50)
    )

    status: Mapped[str] = mapped_column(
        String(50)
    )

    payment_date: Mapped[datetime]