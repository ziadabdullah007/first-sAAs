from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.payment_schema import (
    PaymentCreate,
    PaymentUpdate
)

from app.services.payment_service import (
    PaymentService
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.get("/")
def get_payments(
    db: Session = Depends(get_db)
):
    return PaymentService.get_all_payments(db)


@router.get("/{payment_id}")
def get_payment(
    payment_id: UUID,
    db: Session = Depends(get_db)
):

    payment = PaymentService.get_payment_by_id(
        db,
        payment_id
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return payment


@router.post("/")
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db)
):

    return PaymentService.create_payment(
        db,
        payment.model_dump()
    )


@router.put("/{payment_id}")
def update_payment(
    payment_id: UUID,
    payment: PaymentUpdate,
    db: Session = Depends(get_db)
):

    updated_payment = (
        PaymentService.update_payment(
            db,
            payment_id,
            payment.model_dump()
        )
    )

    if not updated_payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return updated_payment


@router.delete("/{payment_id}")
def delete_payment(
    payment_id: UUID,
    db: Session = Depends(get_db)
):

    result = PaymentService.delete_payment(
        db,
        payment_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return result