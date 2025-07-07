from datetime import datetime
from sqlalchemy.orm import Session
from models import CronLog
from database import SessionLocal


def run_task():
    """Örnek bir görev mantığı"""
    print("Görev çalışıyor...")
    # İşlenen domain sayısını simüle ediyoruz
    processed_domains =10
    return processed_domains


def log_cron_task():
    """Cron görevi çalıştır ve log oluştur"""
    db: Session = SessionLocal()
    try:
        start_time = datetime.utcnow()
        processed_domains = run_task()
        duration = (datetime.utcnow() - start_time).total_seconds()

        # Cron logunu kaydet
        cron_log = CronLog(
            run_date=start_time,
            duration_sec=duration,
            processed_domains=processed_domains
        )
        db.add(cron_log)
        db.commit()
        print(f"Cron log eklendi: {cron_log}")
    except Exception as e:
        print(f"Görev sırasında hata oluştu: {e}")
    finally:
        db.close()
