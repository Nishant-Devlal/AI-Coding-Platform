from datetime import datetime, timedelta, timezone
import jwt
import os
from dotenv import load_dotenv
from pwdlib import PasswordHash
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

load_dotenv()

# Password hashing
password_hash = PasswordHash.recommended()

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not configured")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def create_access_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": str(user_id),
        "exp": expire
    }
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

@router.post(
    "/signup",
    response_model=TokenResponse
)
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = password_hash.hash(
        request.password
    )

    # Create user
    user = User(
        name=request.name,
        email=request.email,
        password_hash=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create JWT
    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    # Find user
    user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    # Invalid email
    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    valid_password = password_hash.verify(
        request.password,
        user.password_hash
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT
    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }