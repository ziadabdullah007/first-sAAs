import uuid

from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4
    )

    auth_user_id: Mapped[uuid.UUID]

    gym_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("gyms.id")
    )

    role: Mapped[str] = mapped_column(
        String(50)
    )

    first_name: Mapped[str | None] = mapped_column(
        String(100)
    )

    last_name: Mapped[str | None] = mapped_column(
        String(100)
    )

    email: Mapped[str | None] = mapped_column(
        String(255)
    )