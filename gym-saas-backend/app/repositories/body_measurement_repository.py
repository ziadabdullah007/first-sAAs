from uuid import UUID

from sqlalchemy.orm import Session

from app.models.body_measurement import BodyMeasurement


class BodyMeasurementRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(BodyMeasurement).all()

    @staticmethod
    def get_by_id(db: Session, measurement_id: UUID):
        return (
            db.query(BodyMeasurement)
            .filter(
                BodyMeasurement.id == measurement_id
            )
            .first()
        )

    @staticmethod
    def create(db: Session, measurement: BodyMeasurement):
        db.add(measurement)
        db.commit()
        db.refresh(measurement)

        return measurement

    @staticmethod
    def update(db: Session, measurement: BodyMeasurement):
        db.commit()
        db.refresh(measurement)

        return measurement

    @staticmethod
    def delete(db: Session, measurement: BodyMeasurement):
        db.delete(measurement)
        db.commit()