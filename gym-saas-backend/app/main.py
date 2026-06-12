from fastapi import FastAPI
from app.api.v1.member_routes import router as member_router
from app.api.v1.plan_routes import router as plan_router
from app.api.v1.auth_routes import (
    router as auth_router
)
from app.api.v1.dashboard_routes import (
    router as dashboard_router
)
from app.api.v1.body_measurement_routes import (
    router as body_measurement_router
)
from app.api.v1.attendance_routes import (
    router as attendance_router
)
from app.api.v1.payment_routes import (
    router as payment_router
)
from app.api.v1.subscription_routes import (
    router as subscription_router
)
app = FastAPI(
    title="Gym SaaS API",
    version="1.0.0"
)
app.include_router(member_router)
app.include_router(plan_router)
app.include_router(auth_router)
app.include_router(body_measurement_router)
app.include_router(payment_router)
app.include_router(subscription_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)
@app.get("/")
def root():
    return {"message": "Gym SaaS API Running"}


