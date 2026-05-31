from sqlalchemy.orm import Session
from app.models.member import Member


class MemberRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Member).all()

    @staticmethod
    def create(db: Session, member: Member):
        db.add(member)
        db.commit()
        db.refresh(member)

        return member