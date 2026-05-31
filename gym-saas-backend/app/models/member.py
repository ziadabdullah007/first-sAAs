from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

import uuid


class Member(Base):
    __tablename__ = "members"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    gym_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gyms.id")
    )

    first_name: Mapped[str] = mapped_column(
        String(100)
    )

    last_name: Mapped[str] = mapped_column(
        String(100)
    )

    email: Mapped[str | None] = mapped_column(
        String(255)
    )

    phone: Mapped[str] = mapped_column(
        String(50)
    )

    date_of_birth: Mapped[date | None]= mapped_column(
    Date
)

    gender: Mapped[str | None] = mapped_column(
        String(20)
    )