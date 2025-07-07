from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from starlette import status
from typing import Annotated, Optional, List
from pydantic import BaseModel, Field
from models import DomainNotificationSetting, Domain, NotificationType
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

# Router
router = APIRouter(
    prefix="/domain_notification_setting",
    tags=["Domain Notification Setting"]
)

class DomainNotificationSettingRequest(BaseModel):
    setting_id: int
    domain_id: int
    type_id: int

    class Config:
        orm_mode = True

class DomainNotificationSettingCreate(BaseModel):
    domain_id: int
    type_id: int

    class Config:
        orm_mode = True


# POST: Create setting
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_domain_notification_setting(
    user: user_dependency, db: db_dependency, request: DomainNotificationSettingCreate
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    try:
        setting = DomainNotificationSetting(**request.dict())
        db.add(setting)
        db.commit()
        db.refresh(setting)
        return setting
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# GET: List settings
@router.get("/", response_model=List[DomainNotificationSettingRequest])
async def get_domain_notification_settings(
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    settings = db.query(DomainNotificationSetting, Domain.domain_name, NotificationType.type_name).join(
        Domain, DomainNotificationSetting.domain_id == Domain.domain_id
    ).join(
        NotificationType, DomainNotificationSetting.type_id == NotificationType.type_id
    ).filter(
        Domain.user_id == user["user_id"]
    ).all()

    # Convert results to the expected format
    result = [
        {
            "setting_id": setting[0].setting_id,
            "domain_id": setting[0].domain_id,
            "type_id": setting[0].type_id,
            "domain_name": setting[1],
            "type_name": setting[2]
        }
        for setting in settings
    ]

    return result


# GET: Specific setting
@router.get("/{setting_id}", response_model=DomainNotificationSettingRequest)
async def get_domain_notification_setting(
    setting_id: int,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    setting = db.query(DomainNotificationSetting).join(Domain).filter(
        DomainNotificationSetting.setting_id == setting_id,
        Domain.user_id == user["user_id"]
    ).first()

    if not setting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DomainNotificationSetting not found")

    return setting

# PUT: Update setting
@router.put("/{setting_id}", response_model=DomainNotificationSettingRequest)
async def update_domain_notification_setting(
    setting_id: int,
    request: DomainNotificationSettingRequest,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    setting = db.query(DomainNotificationSetting).join(Domain).filter(
        DomainNotificationSetting.setting_id == setting_id,
        Domain.user_id == user["user_id"]
    ).first()

    if not setting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DomainNotificationSetting not found")

    setting.domain_id = request.domain_id
    setting.type_id = request.type_id
    db.commit()
    db.refresh(setting)

    return setting

# DELETE: Delete setting
@router.delete("/{setting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_domain_notification_setting(
    setting_id: int,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    setting = db.query(DomainNotificationSetting).join(Domain).filter(
        DomainNotificationSetting.setting_id == setting_id,
        Domain.user_id == user["user_id"]
    ).first()

    if not setting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DomainNotificationSetting not found")

    db.delete(setting)
    db.commit()
