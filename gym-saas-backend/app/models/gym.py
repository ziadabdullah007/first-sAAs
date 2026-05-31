import uuid
from datetime import datetime

from sqlalchemy import String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Gym(Base):
    __tablename__ = "gyms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(255)
    )

    owner_name: Mapped[str] = mapped_column(
        String(255)
    )

    email: Mapped[str] = mapped_column(
        String(255)
    )

    phone: Mapped[str | None] = mapped_column(
        String(50)
    )

    address: Mapped[str | None] = mapped_column(
        Text
    )

    status: Mapped[str] = mapped_column(
        String(50)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )

    # Relationships
    members = relationship(
        "Member",
        back_populates="gym"
    )