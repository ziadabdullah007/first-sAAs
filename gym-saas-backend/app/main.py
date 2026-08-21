from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.member_routes import router as member_router
from app.api.v1.plan_routes import router as plan_router
from app.api.v1.gym_routes import router as gym_router
from app.api.v1.staff_routes import router as staff_router
from app.api.v1.auth_routes import router as auth_router
from app.api.v1.dashboard_routes import router as dashboard_router
from app.api.v1.body_measurement_routes import router as body_measurement_router
from app.api.v1.attendance_routes import router as attendance_router
from app.api.v1.payment_routes import router as payment_router
from app.api.v1.subscription_routes import router as subscription_router

app = FastAPI(
    title="Gym SaaS API",
    version="1.0.0",
    description="Production-ready multi-tenant Gym Management SaaS API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration — reads from environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# All routers mounted under /api/v1 to match frontend expectations
API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(dashboard_router, prefix=API_PREFIX)
app.include_router(member_router, prefix=API_PREFIX)
app.include_router(plan_router, prefix=API_PREFIX)
app.include_router(subscription_router, prefix=API_PREFIX)
app.include_router(payment_router, prefix=API_PREFIX)
app.include_router(attendance_router, prefix=API_PREFIX)
app.include_router(body_measurement_router, prefix=API_PREFIX)
app.include_router(staff_router, prefix=API_PREFIX)
app.include_router(gym_router, prefix=API_PREFIX)


@app.get("/")
def root():
    return {
        "message": "Gym SaaS API Running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}