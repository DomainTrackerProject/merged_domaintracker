from datetime import datetime
from sqlalchemy.orm import Session
from models import Notification, Domain, NotificationDay
from database import SessionLocal
from tasks.notification_tasks import send_email_notification_task

def check_and_send_notifications():
    print("[INFO] check_and_send_notifications çalıştı:", datetime.utcnow())

    db: Session = SessionLocal()
    try:
        notifications = db.query(Notification).join(Notification.domain).join(Notification.notification_days).filter(
            Notification.status == "beklemede"
        ).all()
        print(f"[INFO] Beklemede bildirim sayısı: {len(notifications)}")

        for notification in notifications:
            domain = notification.domain
            user = domain.user

            if not domain or not user:
                print("[WARNING] Domain veya kullanıcı bulunamadı.")
                continue

            print(f"[DEBUG] Domain: {domain.domain_name}, Expiration: {domain.expiration_date}, User: {user.email}")

            days_left = (domain.expiration_date - datetime.utcnow().date()).days
            print(f"[DEBUG] Domain {domain.domain_name} için kalan gün: {days_left}")

            for notify_day in notification.notification_days:
                print(f"[DEBUG] Bildirim günü eşiği: {notify_day.notify_day}")

                if days_left <= notify_day.notify_day:
                    print(f"[INFO] E-posta gönderiliyor -> {user.email}")
                    send_email_notification_task.delay(
                        user_email=user.email,
                        user_name=user.firstname,
                        domain_name=domain.domain_name,
                        expiration_date=str(domain.expiration_date),
                        domain_id=domain.domain_id,
                        type_id=notification.type_id,
                        notify_day=notify_day.notify_day
                    )

                    notification.status = "gönderildi"
                    db.add(notification)
                    break  # Bu domain için yalnızca bir eşleşme yeterlidir

        db.commit()
        print("[INFO] Tüm işlemler başarıyla tamamlandı.")

    except Exception as e:
        print(f"[ERROR] Bildirim kontrolünde hata: {e}")
        db.rollback()
    finally:
        db.close()
