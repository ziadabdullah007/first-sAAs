import uuid
from datetime import datetime

from sqlalchemy import (
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import (
    Mapped,
    mapped_column
)

from app.db.base import Base


class Staff(Base):
    __tablename__ = "staff"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    gym_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gyms.id")
    )

    user_profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user_profiles.id")
    )

    position: Mapped[str] = mapped_column(
        String(50)
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="active"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )