from fastapi import FastAPI

app = FastAPI(
    title="Gym SaaS API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Gym SaaS API Running"}