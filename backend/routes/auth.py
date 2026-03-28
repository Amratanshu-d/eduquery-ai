from fastapi import APIRouter, HTTPException
from models import LoginRequest, TokenResponse
from jose import jwt
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM  = "HS256"

# Hardcoded demo users (in real app use DB + bcrypt)
DEMO_USERS = {
    "teacher@edu.com":  {"password": "teacher123", "role": "teacher"},
    "student@edu.com":  {"password": "student123", "role": "student"},
}

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = DEMO_USERS.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {
            "sub":  req.email,
            "role": user["role"],
            "exp":  datetime.utcnow() + timedelta(hours=8)
        },
        SECRET_KEY, algorithm=ALGORITHM
    )
    return {"access_token": token}