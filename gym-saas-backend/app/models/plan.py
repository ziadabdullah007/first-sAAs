import uuid

from sqlalchemy import ForeignKey, String, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy import ForeignKey

class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4
    )
    subscriptions = relationship(
        "Subscription",
        back_populates="plan"
)
    gym_id: Mapped[uuid.UUID] = mapped_column(
    ForeignKey("gyms.id")
)

    name: Mapped[str] = mapped_column(
        String(255)
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2)
    )

    duration_months: Mapped[int]

    status: Mapped[str]