from uuid import UUID
from datetime import datetime

from app.models.payment import Payment

from app.repositories.payment_repository import (
    PaymentRepository
)


class PaymentService:

    @staticmethod
    def get_all_payments(db):
        return PaymentRepository.get_all(db)

    @staticmethod
    def get_payment_by_id(
        db,
        payment_id: UUID
    ):
        return PaymentRepository.get_by_id(
            db,
            payment_id
        )

    @staticmethod
    def create_payment(
        db,
        payment_data: dict
    ):

        payment_data["status"] = "completed"
        payment_data["payment_date"] = datetime.utcnow()

        payment = Payment(
            **payment_data
        )

        return PaymentRepository.create(
            db,
            payment
        )

    @staticmethod
    def update_payment(
        db,
        payment_id: UUID,
        update_data: dict
    ):

        payment = PaymentRepository.get_by_id(
            db,
            payment_id
        )

        if not payment:
            return None

        for key, value in update_data.items():

            if value is not None:
                setattr(
                    payment,
                    key,
                    value
                )

        return PaymentRepository.update(
            db,
            payment
        )

    @staticmethod
    def delete_payment(
        db,
        payment_id: UUID
    ):

        payment = PaymentRepository.get_by_id(
            db,
            payment_id
        )

        if not payment:
            return None

        PaymentRepository.delete(
            db,
            payment
        )

        return {
            "message":
            "Payment deleted successfully"
        }