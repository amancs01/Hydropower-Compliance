import base64
import hashlib
import hmac
import json
import time
from typing import Callable, Iterable

from fastapi import Depends, Header, HTTPException
from fastapi.responses import JSONResponse

from config import settings


ALLOWED_ROLES = {
    "Developer",
    "Lender",
    "Consultant",
    "Community Liaison",
    "Admin",
    "Regulator",
    "Community User",
}


ROLE_ALIASES = {
    "Lender / Investor": "Lender",
    "Regulator / Reviewer": "Regulator",
    "Community Member": "Community User",
}


def normalize_role(role: str) -> str:
    role = ROLE_ALIASES.get(role, role)
    if role not in ALLOWED_ROLES:
        raise ValueError("Unsupported demo role.")
    return role


def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _b64decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def create_demo_token(role: str) -> str:
    role = normalize_role(role)
    now = int(time.time())
    payload = {
        "role": role,
        "display_name": f"Demo {role}",
        "issued_at": now,
        "exp": now + 12 * 60 * 60,
    }
    body = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(settings.demo_jwt_secret.encode("utf-8"), body.encode("utf-8"), hashlib.sha256).digest()
    return f"{body}.{_b64encode(signature)}"


def decode_demo_token(token: str) -> dict:
    body, signature = token.split(".", 1)
    expected = _b64encode(hmac.new(settings.demo_jwt_secret.encode("utf-8"), body.encode("utf-8"), hashlib.sha256).digest())
    if not hmac.compare_digest(signature, expected):
        raise ValueError("Invalid token signature.")
    payload = json.loads(_b64decode(body))
    if int(payload.get("exp", 0)) < int(time.time()):
        raise ValueError("Token expired.")
    payload["role"] = normalize_role(payload["role"])
    return payload


def forbidden(message: str = "You do not have permission to perform this action."):
    return JSONResponse(
        status_code=403,
        content={"status": "error", "error_code": "FORBIDDEN", "message": message},
    )


def current_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    try:
        return decode_demo_token(authorization.split(" ", 1)[1].strip())
    except Exception:
        return None


def require_roles(allowed_roles: Iterable[str]) -> Callable:
    allowed = {normalize_role(role) for role in allowed_roles}

    def dependency(user=Depends(current_user)):
        if user and (user["role"] in allowed or user["role"] == "Admin"):
            return user
        raise HTTPException(
            status_code=403,
            detail={"status": "error", "error_code": "FORBIDDEN", "message": "You do not have permission to perform this action."},
        )

    return dependency
