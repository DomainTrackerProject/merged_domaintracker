from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated, Optional
from pydantic import BaseModel
from datetime import datetime
from models import Notification, Domain, NotificationType
from database import SessionLocal
from routers.auth import get_current_user
from utils.email_sender import send_email

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

router = APIRouter(
    prefix="/notification",
    tags=["Notification"]
)

class NotificationRequest(BaseModel):
    domain_id: int
    type_id: int
    message_body: str

    class Config:
        orm_mode = True



class NotificationResponse(BaseModel):
    notification_id: int
    domain_id: int
    domain_name: Optional[str]
    type_id: int
    type_name: Optional[str]
    status: str
    message_body: str
    created_at: datetime

    class Config:
        orm_mode = True


@router.post("/")
async def create_notification(
    user: user_dependency, db: db_dependency,request: NotificationRequest
):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        # Notification oluştur
        notification = Notification(
            domain_id=request.domain_id,
            type_id=request.type_id,
            message_body=request.message_body,

        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return {"message": "Notification created and email sent"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# GET: Tüm bildirimleri listele
@router.get("/", response_model=list[NotificationResponse])
async def get_notifications(user: user_dependency, db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    notifications = (
        db.query(Notification)
        .join(Domain)
        .join(NotificationType)
        .filter(Domain.user_id == user["user_id"])
        .all()
    )

    return [
        NotificationResponse(
            notification_id=notif.notification_id,
            domain_id=notif.domain_id,
            domain_name=notif.domain.domain_name,
            type_id=notif.type_id,
            type_name=notif.notification_type.type_name,
            status=notif.status,
            message_body=notif.message_body,
            created_at=notif.created_at
        )
        for notif in notifications
    ]


@router.get("/sent", response_model=list[NotificationResponse])
async def get_sent_notifications(
        user: user_dependency, db: db_dependency
):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    notifications = (
        db.query(Notification)
        .join(Domain)
        .join(NotificationType)
        .filter(
            Notification.status == "gönderildi",
            Domain.user_id == user["user_id"]
        )
        .all()
    )

    return [
        NotificationResponse(
            notification_id=n.notification_id,
            domain_id=n.domain_id,
            domain_name=n.domain.domain_name if n.domain else None,
            type_id=n.type_id,
            type_name=n.notification_type.type_name if n.notification_type else None,
            status=n.status,
            message_body=n.message_body,
            created_at=n.created_at
        )
        for n in notifications
    ]
# GET: Belirli bir bildirimi getir
@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: int,user: user_dependency, db: db_dependency
):
    notification = (
        db.query(Notification)
        .join(Domain)
        .join(NotificationType)
        .filter(
            Notification.notification_id == notification_id,
            Domain.user_id == user["user_id"]
        )
        .first()
    )

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    return NotificationResponse(
        notification_id=notification.notification_id,
        domain_id=notification.domain_id,
        domain_name=notification.domain.domain_name,
        type_id=notification.type_id,
        type_name=notification.notification_type.type_name,
        status=notification.status,
        message_body=notification.message_body,
        created_at=notification.created_at
    )


# PUT: Bildirimi güncelle
@router.put("/{notification_id}")
async def update_notification(
            notification_id: int,request: NotificationRequest,user: user_dependency, db: db_dependency
    ):
        notification = db.query(Notification).join(Domain).filter(
            Notification.notification_id == notification_id,
            Domain.user_id == user["user_id"]
        ).first()

        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")

        notification.domain_id = request.domain_id
        notification.type_id = request.type_id
        notification.message_body = request.message_body
        db.commit()
        db.refresh(notification)

        return {"message": "Notification updated successfully"}



# DELETE: Bildirimi sil
@router.delete("/{notification_id}")
async def delete_notification(
            notification_id: int,user: user_dependency, db: db_dependency
    ):
        notification = db.query(Notification).join(Domain).filter(
            Notification.notification_id == notification_id,
            Domain.user_id == user["user_id"]
        ).first()

        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")

        db.delete(notification)
        db.commit()

        return {"message": "Notification deleted successfully"}
