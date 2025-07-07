from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated, Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from models import NotificationType
from database import SessionLocal
from routers.auth import get_current_user

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# NotificationType Router
router = APIRouter(
    prefix="/notification_type",
    tags=["Notification Type"]
)


class NotificationTypeRequest(BaseModel):
    type_name: str = Field(..., max_length=20, description="Bildirim tipi adı")
    description: Optional[str] = Field(None, max_length=255, description="Açıklama")


class NotificationTypeResponse(NotificationTypeRequest):
    type_id: int  # ✅ Frontend'in ihtiyacı olan ID alanı

    class Config:
        orm_mode = True  # SQLAlchemy objesinden dönüşü mümkün kılar


# GET: Tüm bildirim tiplerini getir
@router.get("/", response_model=List[NotificationTypeResponse])
async def get_notification_types(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return db.query(NotificationType).all()


# POST: Yeni bildirim tipi oluştur
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=NotificationTypeResponse)
async def create_notification_type(
        user: user_dependency, db: db_dependency, request: NotificationTypeRequest
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    try:
        notification_type = NotificationType(**request.dict())
        db.add(notification_type)
        db.commit()
        db.refresh(notification_type)
        return notification_type
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# GET: Belirli bir bildirimi getir
@router.get("/{type_id}", response_model=NotificationTypeResponse)
async def get_notification_type(
        type_id: int,
        user: user_dependency,
        db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    type_obj = db.query(NotificationType).filter(NotificationType.type_id == type_id).first()
    if not type_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification type not found")

    return type_obj


# PUT: Bildirim tipini güncelle
@router.put("/{type_id}", response_model=NotificationTypeResponse)
async def update_notification_type(
        type_id: int,
        request: NotificationTypeRequest,
        user: user_dependency,
        db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    type_obj = db.query(NotificationType).filter(NotificationType.type_id == type_id).first()
    if not type_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification type not found")

    type_obj.type_name = request.type_name
    type_obj.description = request.description
    db.commit()
    db.refresh(type_obj)

    return type_obj


# DELETE: Bildirim tipini sil
@router.delete("/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification_type(
        type_id: int,
        user: user_dependency,
        db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    type_obj = db.query(NotificationType).filter(NotificationType.type_id == type_id).first()
    if not type_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification type not found")

    db.delete(type_obj)
    db.commit()
