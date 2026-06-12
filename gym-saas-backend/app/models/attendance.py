import uuid

from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4
    )
    member = relationship(
        "Member",
        back_populates="attendance_records"
    )

    gym = relationship(
        "Gym"
    )



    member_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("members.id")
    )

    gym_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gyms.id")
    )

    check_in_time: Mapped[datetime]

    check_out_time: Mapped[datetime | None]