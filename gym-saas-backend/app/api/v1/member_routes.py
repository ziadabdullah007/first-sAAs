from fastapi import APIRouter

router = APIRouter(
    prefix="/members",
    tags=["Members"]
)


@router.get("/")
def get_members():
    return {
        "message": "Members Endpoint"
    }