from typing import List
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from models import CronLog
from database import SessionLocal
from routers.auth import get_current_user

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Depends(get_db)
user_dependency = Depends(get_current_user)

router = APIRouter(prefix="/cron_logs", tags=["Cron Logs"])

# Define a Pydantic model for CronLog
class CronLogResponse(BaseModel):
    log_id: int
    run_date: datetime
    duration_sec: float
    processed_domains: int
    created_at: datetime

    class Config:
        orm_mode = True

# Define a Pydantic model for creating CronLog
class CronLogCreate(BaseModel):
    duration_sec: float
    processed_domains: int

# Define the route for getting the list of cron logs
@router.get("/", response_model=List[CronLogResponse])
async def get_cron_logs(db: Session = Depends(get_db)):
    return db.query(CronLog).order_by(CronLog.run_date.desc()).all()

@router.get("/{log_id}", response_model=CronLogResponse)
async def get_cron_log(log_id: int, user: dict = user_dependency, db: Session = db_dependency):
    _authorize(user)
    cron_log = db.query(CronLog).filter(CronLog.log_id == log_id).first()
    if not cron_log:
        raise HTTPException(status_code=404, detail="Cron Log Not Found")
    return cron_log

@router.post("/", status_code=201, response_model=CronLogResponse)
async def create_cron_log(request: CronLogCreate, user: dict = user_dependency, db: Session = db_dependency):
    _authorize(user)
    cron_log = CronLog(**request.dict())
    db.add(cron_log)
    db.commit()
    db.refresh(cron_log)
    return cron_log

@router.delete("/{log_id}", status_code=204)
async def delete_cron_log(log_id: int, user: dict = user_dependency, db: Session = db_dependency):
    _authorize(user)
    cron_log = db.query(CronLog).filter(CronLog.log_id == log_id).first()
    if not cron_log:
        raise HTTPException(status_code=404, detail="Cron Log Not Found")
    db.delete(cron_log)
    db.commit()

def _authorize(user):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
