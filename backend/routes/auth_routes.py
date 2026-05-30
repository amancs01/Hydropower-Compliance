from fastapi import APIRouter
from pydantic import BaseModel

from services.auth_service import create_demo_token, normalize_role


router = APIRouter(prefix="/api/auth", tags=["auth"])


class DemoLoginRequest(BaseModel):
    role: str


@router.post("/demo-login")
def demo_login(payload: DemoLoginRequest):
    role = normalize_role(payload.role)
    return {
        "access_token": create_demo_token(role),
        "token_type": "bearer",
        "role": role,
        "display_name": f"Demo {role}",
    }

