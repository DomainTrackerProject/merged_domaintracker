from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated, Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from models import WhoisLog, Domain
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
    prefix="/whois_log",
    tags=["Whois Log"]
)

# Schemas
class WhoisLogRequest(BaseModel):
    domain_id: int = Field(..., description="Domain ID")
    whois_data: dict = Field(..., description="WHOIS JSON verisi")

class WhoisLogResponse(BaseModel):
    log_id: int
    domain_id: int
    whois_data: dict
    retrieved_at: datetime

    class Config:
        orm_mode = True

# Kullanıcının domainlerine ait WHOIS loglarını getir
@router.get("/", response_model=List[WhoisLogResponse])
async def get_whois_logs(user: user_dependency, db: db_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user_domains = db.query(Domain.domain_id).filter(Domain.user_id == user.get("user_id")).subquery()
    whois_logs = db.query(WhoisLog).filter(WhoisLog.domain_id.in_(user_domains)).all()
    return whois_logs

# WHOIS log oluştur
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=WhoisLogResponse)
async def create_whois_log(user: user_dependency, db: db_dependency, request: WhoisLogRequest):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    # Kullanıcının bu domaine sahip olup olmadığını kontrol et
    domain = db.query(Domain).filter(Domain.domain_id == request.domain_id, Domain.user_id == user.get("user_id")).first()
    if not domain:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bu domain size ait değil.")

    whois_log = WhoisLog(**request.model_dump(), retrieved_at=datetime.utcnow())
    db.add(whois_log)
    db.commit()
    db.refresh(whois_log)
    return whois_log

# Belirli bir WHOIS logunu getir
@router.get("/{log_id}", response_model=WhoisLogResponse)
async def get_whois_log_by_id(log_id: int, user: user_dependency, db: db_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    whois_log = db.query(WhoisLog).filter(WhoisLog.log_id == log_id).first()
    if not whois_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WHOIS log bulunamadı")

    # Kullanıcının bu domaine erişimi olup olmadığını kontrol et
    domain = db.query(Domain).filter(Domain.domain_id == whois_log.domain_id, Domain.user_id == user.get("user_id")).first()
    if not domain:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bu log size ait bir domaine ait değil.")

    return whois_log
