from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Annotated
from datetime import datetime, timedelta
from pydantic import BaseModel
from database import SessionLocal
from models import NotificationDay, Notification, Domain
from routers.auth import get_current_user
from tasks.notification_tasks import send_email_notification_task

import logging

logger = logging.getLogger(__name__)

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

router = APIRouter(prefix="/notification_day", tags=["Notification Day"])


class NotificationDayRequest(BaseModel):
    notification_id: int
    notify_day: int

    class Config:
        orm_mode = True


@router.post("/", status_code=201)
async def create_notification_day(user: user_dependency, db: db_dependency, request: NotificationDayRequest):
    _authorize(user)
    try:
        logger.info(f"Creating notification day for notification_id: {request.notification_id}")
        notification = db.query(Notification).join(Domain).filter(
            Notification.notification_id == request.notification_id,
            Domain.user_id == user["user_id"]
        ).first()

        if not notification:
            raise HTTPException(status_code=403, detail="Yetkisiz işlem.")

        day = NotificationDay(**request.dict())
        db.add(day)
        db.commit()
        db.refresh(day)

        notify_date = notification.domain.expiration_date - timedelta(days=request.notify_day)
        logger.info(f"Notification day set to notify {notify_date}")

        if notification.notification_type.type_name.lower() == "email" and notify_date <= datetime.utcnow().date():
            logger.info(f"Scheduling email for {user['email']} regarding domain {notification.domain.domain_name}")
            send_email_notification_task.delay(
                user_email=user["email"],
                user_name=user["firstname"],
                domain_name=notification.domain.domain_name,
                expiration_date=str(notification.domain.expiration_date),
                domain_id=notification.domain.domain_id,
                type_id=notification.notification_type.type_id,
                notify_day = request.notify_day
            )

        return day

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Error creating notification day: {str(e)}")
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

@router.get("/")
async def get_notification_days(user: user_dependency, db: db_dependency):
    _authorize(user)
    return db.query(NotificationDay).join(NotificationDay.notification).join(
        Notification.domain).filter(
        Domain.user_id == user["user_id"]
    ).all()


@router.get("/{day_id}")
async def get_notification_day(day_id: int, user: user_dependency, db: db_dependency):
    _authorize(user)
    day = db.query(NotificationDay).join(NotificationDay.notification).join(Notification.domain).filter(
        NotificationDay.day_id == day_id,
        Domain.user_id == user["user_id"]
    ).first()
    if not day:
        raise HTTPException(status_code=404, detail="NotificationDay not found")
    return day


@router.put("/{day_id}")
async def update_notification_day(day_id: int, request: NotificationDayRequest, user: user_dependency, db: db_dependency):
    _authorize(user)
    day = db.query(NotificationDay).join(NotificationDay.notification).join(Notification.domain).filter(
        NotificationDay.day_id == day_id,
        Domain.user_id == user["user_id"]
    ).first()
    if not day:
        raise HTTPException(status_code=404, detail="NotificationDay not found")

    day.notification_id = request.notification_id
    day.notify_day = request.notify_day
    db.commit()
    db.refresh(day)
    return day


@router.delete("/{day_id}", status_code=204)
async def delete_notification_day(day_id: int, user: user_dependency, db: db_dependency):
    _authorize(user)
    day = db.query(NotificationDay).join(NotificationDay.notification).join(Notification.domain).filter(
        NotificationDay.day_id == day_id,
        Domain.user_id == user["user_id"]
    ).first()
    if not day:
        raise HTTPException(status_code=404, detail="NotificationDay not found")
    db.delete(day)
    db.commit()


def _authorize(user):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
