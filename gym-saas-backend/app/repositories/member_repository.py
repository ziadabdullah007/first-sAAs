from uuid import UUID

from sqlalchemy.orm import Session

from app.models.member import Member


class MemberRepository:

    @staticmethod
    def get_all(
        db: Session,
        gym_id: UUID | None = None
    ):
        if gym_id:
            return db.query(Member).filter(
                Member.gym_id == gym_id
            ).all()
        return db.query(Member).all()

    @staticmethod
    def get_by_id(
        db: Session,
        member_id: UUID,
        gym_id: UUID | None = None
    ):
        query = db.query(Member).filter(Member.id == member_id)
        if gym_id:
            query = query.filter(Member.gym_id == gym_id)
        return query.first()

    @staticmethod
    def create(db: Session, member: Member):
        db.add(member)
        db.commit()
        db.refresh(member)
        return member

    @staticmethod
    def update(db: Session, member: Member):
        db.commit()
        db.refresh(member)
        return member

    @staticmethod
    def delete(db: Session, member: Member):
        db.delete(member)
        db.commit()