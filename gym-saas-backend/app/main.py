from fastapi import FastAPI
from app.api.v1.member_routes import router as member_router

app = FastAPI(
    title="Gym SaaS API",
    version="1.0.0"
)
app.include_router(member_router)

@app.get("/")
def root():
    return {"message": "Gym SaaS API Running"}


