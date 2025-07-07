import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

# Load .env variables
load_dotenv()
CELERY_BROKER = os.getenv("CELERY_BROKER", "redis://redis:6379/0")
CELERY_BACKEND = os.getenv("CELERY_BACKEND", "redis://redis:6379/0")


app = Celery(
    "celery_app",
    broker=CELERY_BROKER,
    backend=CELERY_BACKEND,
    include=["tasks.notification_tasks"]
)

app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
app.conf.beat_schedule = {
    'send_email_notification_task_every_day': {
        'task': 'tasks.notification_tasks.send_email_notification_task',
        'schedule': crontab(minute=0, hour=9),
    },
}


def get_send_email_notification_task():
    from tasks.notification_tasks import send_email_notification_task
    return send_email_notification_task

