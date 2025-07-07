from datetime import datetime
from celery_app import app
from database import SessionLocal
from models import Notification
from utils.email_sender import send_email
import logging

logger = logging.getLogger(__name__)

@app.task(name="tasks.notification_tasks.send_email_notification_task")
def send_email_notification_task(user_email, user_name, domain_name, expiration_date, notify_day, domain_id, type_id):
    if not user_email or not user_name or not domain_name:
        logger.warning(
            f"Email task skipped due to missing fields: user_email={user_email}, user_name={user_name}, domain_name={domain_name}")
        return
    message = (
        f"Merhaba {user_name},\n\n"
        f"{domain_name} domaininizin süresi {expiration_date} tarihinde sona eriyor.\n"
        f"Bu, {notify_day} gün önceden yapılan bir hatırlatmadır.\n\n"
        f"Domain Takip Sistemi"
    )

    send_email(message, user_email, subject="Domain Süresi Yaklaşıyor")

    db = SessionLocal()
    try:
        notification = Notification(
            domain_id=domain_id,
            type_id=type_id,
            status="basarili",
            message_body=message
        )
        db.add(notification)
        db.commit()
    finally:
        db.close()
