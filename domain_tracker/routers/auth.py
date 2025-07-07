from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, EmailStr
from starlette import status
from datetime import timedelta, datetime, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
import random
import string

from database import SessionLocal
from models import User
from utils.email_sender import send_email

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY","defaultsecret")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY","refreshsecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===================== MODELS =====================

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class CreateUserRequest(BaseModel):
    firstname: str
    lastname: str
    username: str
    email: EmailStr
    phone_number: str | None = None
    password: str
    role: str

class UpdateUserRequest(BaseModel):
    firstname: str | None = None
    lastname: str | None = None
    username: str | None = None
    email: EmailStr | None = None
    phone_number: str | None = None
    role: str | None = None

class UpdateUserRequestWithPassword(UpdateUserRequest):
    old_password: str | None = None
    new_password: str | None = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetForm(BaseModel):
    reset_code: str
    new_password: str

# ===================== UTILS =====================

def generate_reset_code(length=12):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def create_token(data: dict, expires_delta: timedelta, secret_key: str):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)

def create_access_token(user: User):
    return create_token({
        "sub": user.username,
        "user_id": user.user_id,
        "role": user.role,
        "email": user.email,
        "firstname": user.firstname
    }, timedelta(minutes=600), SECRET_KEY)

def create_refresh_token(user: User):
    return create_token({
        "sub": user.username,
        "user_id": user.user_id,
        "role": user.role,
        "email": user.email,
        "firstname": user.firstname

    }, timedelta(days=7), REFRESH_SECRET_KEY)

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user or not bcrypt_context.verify(password, user.password_hash):
        return None
    return user

async def get_current_user(token: str = Depends(oauth_bearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "username": payload.get("sub"),
            "user_id": payload.get("user_id"),
            "email": payload.get("email"),
            "firstname": payload.get("firstname"),
            "role": payload.get("role")
        }
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# ===================== ROUTES =====================

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: CreateUserRequest, db: Session = Depends(get_db)):
    if db.query(User).filter((User.username == create_user_request.username) | (User.email == create_user_request.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    user = User(
        firstname=create_user_request.firstname,
        lastname=create_user_request.lastname,
        username=create_user_request.username,
        email=create_user_request.email,
        phone_number=create_user_request.phone_number,
        role=create_user_request.role,
        is_active=True,
        password_hash=bcrypt_context.hash(create_user_request.password)
    )
    db.add(user)
    db.commit()
    return {"user_id": user.user_id, "email": user.email}


@router.post("/token", response_model=Token)
async def login_for_access_token(
    username: str = Form(...),
    password: str = Form(...),
    remember_me: bool = Form(False),
    db: Session = Depends(get_db)
):
    user = authenticate_user(username, password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_expiry = timedelta(days=7) if remember_me else timedelta(minutes=60)
    refresh_expiry = timedelta(days=30) if remember_me else timedelta(days=7)

    access_token = create_token({
        "sub": user.username,
        "user_id": user.user_id,
        "role": user.role,
        "email": user.email,
        "firstname": user.firstname
    }, access_expiry, SECRET_KEY)

    refresh_token = create_token({
        "sub": user.username,
        "user_id": user.user_id,
        "role": user.role,
        "email": user.email,
        "firstname": user.firstname
    }, refresh_expiry, REFRESH_SECRET_KEY)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


@router.post("/refresh", response_model=Token)
async def refresh_access_token(refresh_token: str = Form(...)):
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        username = payload.get("sub")
        if not user_id or not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        # Dummy role as it's not in refresh token, better store role in db and requery if needed
        return {
            "access_token": create_token({"sub": username, "user_id": user_id, "role": "user"}, timedelta(minutes=60), SECRET_KEY),
            "refresh_token": refresh_token
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me", status_code=200)
async def get_logged_in_user(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user.user_id,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role,
        "is_active": user.is_active
    }


@router.put("/update", status_code=200)
async def update_user(update_request: UpdateUserRequestWithPassword, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_request.username:
        if db.query(User).filter(User.username == update_request.username, User.user_id != user.user_id).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        user.username = update_request.username
    if update_request.email:
        if db.query(User).filter(User.email == update_request.email, User.user_id != user.user_id).first():
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = update_request.email
    if update_request.firstname:
        user.firstname = update_request.firstname
    if update_request.lastname:
        user.lastname = update_request.lastname
    if update_request.phone_number:
        user.phone_number = update_request.phone_number
    if update_request.role:
        user.role = update_request.role
    if update_request.old_password and update_request.new_password:
        if not bcrypt_context.verify(update_request.old_password, user.password_hash):
            raise HTTPException(status_code=401, detail="Old password is incorrect")
        user.password_hash = bcrypt_context.hash(update_request.new_password)

    db.commit()
    db.refresh(user)
    return {"message": "User updated successfully", "user": {
        "user_id": user.user_id,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role
    }}


@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.reset_code and user.reset_code_expiry and datetime.now(timezone.utc) < user.reset_code_expiry:
        raise HTTPException(status_code=429, detail="Reset code already sent. Please check your email.")

    reset_code = generate_reset_code()
    expiry_time = datetime.now(timezone.utc) + timedelta(minutes=15)
    user.reset_code = reset_code
    user.reset_code_expiry = expiry_time
    db.commit()

    send_email(f"Şifre sıfırlama kodunuz: {reset_code}\n\nBu kod 15 dakika boyunca geçerlidir.", user.email, "Şifre Sıfırlama Kodu")

    return {"message": "Şifre sıfırlama kodu e-posta adresinize gönderildi."}


@router.post("/reset-password")
async def reset_password(form_data: PasswordResetForm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_code == form_data.reset_code).first()
    if not user or datetime.now(timezone.utc) > user.reset_code_expiry:
        raise HTTPException(status_code=400, detail="Invalid or expired reset code")

    user.password_hash = bcrypt_context.hash(form_data.new_password)
    user.reset_code = None
    user.reset_code_expiry = None
    db.commit()

    return {"message": "Şifreniz başarıyla güncellendi."}
@router.delete("/delete-account", status_code=200)
async def delete_own_account(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "Hesabınız başarıyla silindi."}
@router.post("/2fa/toggle", status_code=200)
async def toggle_two_factor(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.two_factor_enabled = not user.two_factor_enabled
    db.commit()
    db.refresh(user)
    return {"message": f"Two-factor authentication {'enabled' if user.two_factor_enabled else 'disabled'}."}

@router.get("/2fa/status", status_code=200)
async def get_two_factor_status(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"two_factor_enabled": user.two_factor_enabled}