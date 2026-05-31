import uuid

from sqlalchemy import String, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SaaSPlan(Base):
    __tablename__ = "saas_plans"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(100)
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2)
    )

    max_members_per_gym: Mapped[int | None]