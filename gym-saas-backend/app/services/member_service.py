from uuid import UUID
from datetime import datetime

from app.models.member import Member
from app.repositories.member_repository import MemberRepository


class MemberService:

    @staticmethod
    def get_all_members(
        db,
        gym_id: UUID | None = None
    ):
        return MemberRepository.get_all(db, gym_id)

    @staticmethod
    def get_member_by_id(
        db,
        member_id: UUID,
        gym_id: UUID | None = None
    ):
        return MemberRepository.get_by_id(db, member_id, gym_id)

    @staticmethod
    def create_member(
        db,
        member_data: dict,
        gym_id: UUID | None = None
    ):
        if gym_id:
            member_data["gym_id"] = gym_id

        now = datetime.utcnow()
        member_data["status"] = "active"
        member_data["joined_at"] = now
        member_data["created_at"] = now
        member_data["updated_at"] = now

        member = Member(**member_data)
        return MemberRepository.create(db, member)

    @staticmethod
    def update_member(
        db,
        member_id: UUID,
        update_data: dict,
        gym_id: UUID | None = None
    ):
        member = MemberRepository.get_by_id(db, member_id, gym_id)
        if not member:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(member, key, value)

        member.updated_at = datetime.utcnow()
        return MemberRepository.update(db, member)

    @staticmethod
    def delete_member_by_id(
        db,
        member_id: UUID,
        gym_id: UUID | None = None
    ):
        member = MemberRepository.get_by_id(db, member_id, gym_id)
        if not member:
            return None

        MemberRepository.delete(db, member)
        return {"message": "Member deleted successfully"}