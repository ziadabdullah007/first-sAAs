from uuid import UUID

from app.models.member import Member
from app.repositories.member_repository import MemberRepository


class MemberService:

    @staticmethod
    def get_all_members(db):
        return MemberRepository.get_all(db)

    @staticmethod
    def get_member_by_id(db, member_id: UUID):
        return MemberRepository.get_by_id(db, member_id)

    @staticmethod
    def create_member(db, member: Member):
        return MemberRepository.create(db, member)

    @staticmethod
    def delete_member(db, member: Member):
        return MemberRepository.delete(db, member)