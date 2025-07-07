import sys
import time
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.exc import OperationalError

# Local modüller
sys.path.append(str(Path(__file__).resolve().parent.parent))
from models import Base
from database import engine
from routers.domain import router as domain_router
from routers.auth import router as auth_router
from routers.domain_notification_setting import router as domain_notification_setting
from routers.notification import router as notification
from routers.notification_day import router as notification_day
from routers.notification_type import router as notification_type
from routers.whois_log import router as whois_log
from routers.cron_log import router as cron_log
from scheduler import check_and_send_notifications
from cron_tasks import log_cron_task

# FastAPI uygulaması
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'lar
app.include_router(auth_router)
app.include_router(domain_router)
app.include_router(domain_notification_setting)
app.include_router(notification)
app.include_router(notification_day)
app.include_router(notification_type)
app.include_router(whois_log)
app.include_router(cron_log)

# Zamanlayıcı (Scheduler)
scheduler = BackgroundScheduler()
scheduler.add_job(check_and_send_notifications, 'interval', hours=1)
scheduler.add_job(log_cron_task, 'interval', minutes=5)
scheduler.start()

# Veritabanını başlatma fonksiyonu (retry'li)
def initialize_database():
    MAX_RETRIES = 10
    RETRY_DELAY = 2  # saniye
    retries = 0
    while retries < MAX_RETRIES:
        try:
            Base.metadata.create_all(bind=engine)
            print("✅ Database initialized.")
            break
        except OperationalError as e:
            retries += 1
            print(f"❌ DB bağlantı hatası: {e}. Tekrar deneme ({retries}/{MAX_RETRIES})...")
            time.sleep(RETRY_DELAY)
    else:
        print("🔥 Maksimum tekrar denemesi aşıldı. DB bağlantısı sağlanamadı.")
        raise

# Uygulama başlatıldığında veritabanını initialize et
initialize_database()

# Uygulama kapanırken zamanlayıcıyı durdur
@app.on_event("shutdown")
def shutdown_event():
    try:
        if scheduler.running:
            scheduler.shutdown(wait=False)
            print("🛑 Scheduler durduruldu.")
    except Exception as e:
        print(f"Scheduler shutdown error: {e}")
