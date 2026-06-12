from fastapi import FastAPI
from app.api.v1.member_routes import router as member_router
from app.api.v1.plan_routes import router as plan_router
from app.api.v1.subscription_routes import (
    router as subscription_router
)
app = FastAPI(
    title="Gym SaaS API",
    version="1.0.0"
)
app.include_router(member_router)
app.include_router(plan_router)
app.include_router(subscription_router)

@app.get("/")
def root():
    return {"message": "Gym SaaS API Running"}


