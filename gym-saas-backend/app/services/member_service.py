from app.models.member import Member


class MemberService:

    @staticmethod
    def create_member(data):
        return Member(**data)