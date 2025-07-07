from fastapi import APIRouter, Depends, Path, HTTPException
from passlib.handlers.bcrypt import bcrypt
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy.orm import Session
from starlette import status
from datetime import date, datetime
from models import Domain, WhoisLog
from database import SessionLocal
from typing import Annotated, Optional
from routers.auth import get_current_user
from routers.whois_log import get_whois_log_by_id

from dateutil.parser import parse
import whois
import time

router = APIRouter(
    prefix="/domain",
    tags=["Domain"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class DomainResponse(BaseModel):
    domain_id: int
    domain_name: str
    expiration_date: date
    status: str

    class Config:
        orm_mode = True

class DomainDetailResponse(DomainResponse):
    registrar: Optional[str]
    name_servers: Optional[list[str]]
    creation_date: Optional[date]
    last_whois_check: Optional[datetime]

class DomainRequest(BaseModel):
    domain_name: str = Field(..., max_length=255)
    expiration_date: date
    status: Optional[str] = Field('Aktif')

    class Config:
        from_attributes = True

def fetch_whois_data(domain_name: str):
    try:
        time.sleep(1)
        whois_data = whois.whois(domain_name)

        if not whois_data or "No match for" in str(whois_data):
            raise HTTPException(status_code=400, detail=f"Domain '{domain_name}' kayıtlı değil veya bulunamadı.")

        def convert_datetime(value):
            if isinstance(value, list):
                return [v.isoformat() if isinstance(v, datetime) else v for v in value]
            return value.isoformat() if isinstance(value, datetime) else value

        return {
            "domain_name": domain_name,
            "registrar": whois_data.registrar,
            "creation_date": convert_datetime(whois_data.creation_date),
            "expiration_date": convert_datetime(whois_data.expiration_date),
            "status": whois_data.status,
            "name_servers": whois_data.name_servers
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"WHOIS sorgusu başarısız: {str(e)}")

def update_status_if_expired(domain: Domain):
    domain.status = "Pasif" if domain.expiration_date < date.today() else "Aktif"

# Kullanıcının tüm domainlerini getir
@router.get("/", response_model=list[DomainResponse])
async def read_all(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    domains = db.query(Domain).filter(Domain.user_id == user.get('user_id')).all()

    for domain in domains:
        update_status_if_expired(domain)
    db.commit()

    return domains



@router.get("/{domain_id}", response_model=DomainDetailResponse, status_code=status.HTTP_200_OK)
async def read_by_id(
    user: user_dependency,
    db: db_dependency,
    domain_id: int = Path(gt=0)
):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Kullanıcı doğrulaması başarısız.")

    domain = db.query(Domain).filter(Domain.domain_id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Domain ID {domain_id} bulunamadı")

    whois_log = db.query(WhoisLog).filter(WhoisLog.domain_id == domain.domain_id).order_by(
        WhoisLog.retrieved_at.desc()).first()

    whois_data = whois_log.whois_data if whois_log else {}

    creation = whois_data.get("creation_date")
    creation_str = creation[0] if isinstance(creation, list) else creation

    try:
        parsed_creation_date = parse(creation_str).date() if creation_str else None
    except (ValueError, TypeError) as e:
        parsed_creation_date = None
        print(f"Error parsing creation date: {e}")

    return {
        "domain_id": domain.domain_id,
        "domain_name": domain.domain_name,
        "expiration_date": domain.expiration_date,
        "status": domain.status,
        "registrar": whois_data.get("registrar"),
        "name_servers": whois_data.get("name_servers"),
        "creation_date": parsed_creation_date,
        "last_whois_check": whois_log.retrieved_at if whois_log else None
    }



@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_domain(user: user_dependency, db: db_dependency, domain_request: DomainRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user_id = user.get("user_id")
    existing_domain = db.query(Domain).filter(Domain.domain_name == domain_request.domain_name).first()
    if existing_domain:
        raise HTTPException(status_code=400, detail="Bu domain zaten kayıtlı.")

    domain = Domain(
        domain_name=domain_request.domain_name,
        expiration_date=domain_request.expiration_date,
        status=domain_request.status,
        user_id=user_id
    )

    update_status_if_expired(domain)

    try:
        db.add(domain)
        db.commit()
        db.refresh(domain)

        whois_data = fetch_whois_data(domain.domain_name)
        whois_log = WhoisLog(domain_id=domain.domain_id, whois_data=whois_data, retrieved_at=datetime.utcnow())
        db.add(whois_log)
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Domain başarıyla eklendi", "domain": domain, "whois_log": whois_log}

@router.put("/{domain_id}/refresh", status_code=status.HTTP_200_OK)
async def refresh_whois(user: user_dependency, db: db_dependency, domain_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    domain = db.query(Domain).filter(Domain.domain_id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Domain bulunamadı")

    whois_data = fetch_whois_data(domain.domain_name)
    domain.expiration_date = whois_data.get("expiration_date")
    update_status_if_expired(domain)

    db.add(domain)
    db.commit()

    return {"message": "WHOIS bilgileri güncellendi.", "domain": domain}

@router.put("/{domain_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_domain(user: user_dependency, db: db_dependency, domain_request: DomainRequest, domain_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    domain = db.query(Domain).filter(Domain.domain_id == domain_id, Domain.user_id == user.get('user_id')).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain bulunamadı")

    domain.domain_name = domain_request.domain_name
    domain.expiration_date = domain_request.expiration_date
    domain.status = domain_request.status
    update_status_if_expired(domain)

    db.add(domain)
    db.commit()

@router.delete("/{domain_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_domain(user: user_dependency, db: db_dependency, domain_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    domain = db.query(Domain).filter(Domain.domain_id == domain_id, Domain.user_id == user.get('user_id')).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain bulunamadı")

    db.delete(domain)
    db.commit()
