import uuid

from datetime import datetime

from sqlalchemy import Numeric, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BodyMeasurement(Base):
    __tablename__ = "body_measurements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    member_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("members.id")
    )

    measured_at: Mapped[datetime]

    weight: Mapped[float | None] = mapped_column(
        Numeric(5, 2)
    )

    body_fat_percentage: Mapped[float | None] = mapped_column(
        Numeric(4, 1)
    )

    bmi: Mapped[float | None] = mapped_column(
        Numeric(4, 1)
    )

    notes: Mapped[str | None] = mapped_column(
        Text
    )