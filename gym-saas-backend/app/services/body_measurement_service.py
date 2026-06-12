from uuid import UUID
from datetime import datetime

from app.models.body_measurement import BodyMeasurement

from app.repositories.body_measurement_repository import (
    BodyMeasurementRepository
)


class BodyMeasurementService:

    @staticmethod
    def get_all_measurements(db):
        return BodyMeasurementRepository.get_all(db)

    @staticmethod
    def get_measurement_by_id(
        db,
        measurement_id: UUID
    ):
        return BodyMeasurementRepository.get_by_id(
            db,
            measurement_id
        )

    @staticmethod
    def create_measurement(
        db,
        measurement_data: dict
    ):

        measurement_data["measured_at"] = (
            datetime.utcnow()
        )

        measurement = BodyMeasurement(
            **measurement_data
        )

        return BodyMeasurementRepository.create(
            db,
            measurement
        )

    @staticmethod
    def update_measurement(
        db,
        measurement_id: UUID,
        update_data: dict
    ):

        measurement = (
            BodyMeasurementRepository.get_by_id(
                db,
                measurement_id
            )
        )

        if not measurement:
            return None

        for key, value in update_data.items():

            if value is not None:
                setattr(
                    measurement,
                    key,
                    value
                )

        return BodyMeasurementRepository.update(
            db,
            measurement
        )

    @staticmethod
    def delete_measurement(
        db,
        measurement_id: UUID
    ):

        measurement = (
            BodyMeasurementRepository.get_by_id(
                db,
                measurement_id
            )
        )

        if not measurement:
            return None

        BodyMeasurementRepository.delete(
            db,
            measurement
        )

        return {
            "message":
            "Measurement deleted successfully"
        }