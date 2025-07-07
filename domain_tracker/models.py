from datetime import datetime, timedelta, timezone

from sqlalchemy import (Column, Integer, String, ForeignKey, Date, DateTime, JSON, Float, CheckConstraint, Text,
                        Boolean)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

def default_expiry():
    return datetime.now(timezone.utc) + timedelta(hours=1)

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    two_factor_enabled = Column(Boolean, default=False)
    avatar_url = Column(String(255), nullable=True)
    firstname = Column(String(50), nullable=False)
    lastname = Column(String(50), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(20))
    password_hash = Column(String(256), nullable=False)
    is_active=Column(Boolean,default=True)
    reset_code = Column(String, nullable=True)
    reset_code_expiry = Column(DateTime(timezone=True), default=default_expiry, nullable=True)
    role=Column(String)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())

    domains = relationship("Domain", back_populates="user", cascade="all, delete-orphan")


class Domain(Base):
    __tablename__ = 'domains'

    domain_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    domain_name = Column(String(255), unique=True, nullable=False)
    expiration_date = Column(Date, nullable=False)
    status = Column(String(20), default='Aktif')
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())

    user = relationship("User", back_populates="domains")
    whois_logs = relationship("WhoisLog", back_populates="domain", cascade="all, delete-orphan")
    notification_settings = relationship("DomainNotificationSetting", back_populates="domain", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="domain", cascade="all, delete-orphan")


class WhoisLog(Base):
    __tablename__ = 'whois_logs'

    log_id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.domain_id', ondelete='CASCADE'), nullable=False)
    whois_data = Column(JSON)
    retrieved_at = Column(DateTime, default=func.current_timestamp())

    domain = relationship("Domain", back_populates="whois_logs")


class NotificationType(Base):
    __tablename__ = 'notification_types'

    type_id = Column(Integer, primary_key=True)
    type_name = Column(String(20), unique=True, nullable=False)
    description = Column(String(255))


class DomainNotificationSetting(Base):
    __tablename__ = 'domain_notification_settings'

    setting_id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.domain_id', ondelete='CASCADE'), nullable=False)
    type_id = Column(Integer, ForeignKey('notification_types.type_id'), nullable=False)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())

    domain = relationship("Domain", back_populates="notification_settings")
    notification_type = relationship("NotificationType")



class NotificationDay(Base):
    __tablename__ = 'notification_days'

    day_id = Column(Integer, primary_key=True)
    notification_id = Column(Integer, ForeignKey('notifications.notification_id', ondelete='CASCADE'), nullable=False)
    notify_day = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint('notify_day > 0', name='check_notify_day_positive'),
    )

    notification = relationship("Notification", back_populates="notification_days")





class Notification(Base):
    __tablename__ = 'notifications'

    notification_id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.domain_id', ondelete='CASCADE'), nullable=False)
    type_id = Column(Integer, ForeignKey('notification_types.type_id'), nullable=False)
    status = Column(String(20), default='beklemede')
    message_body = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())

    domain = relationship("Domain", back_populates="notifications")
    notification_type = relationship("NotificationType")
    notification_days = relationship("NotificationDay", back_populates="notification", cascade="all, delete-orphan")

class CronLog(Base):
    __tablename__ = 'cron_logs'

    log_id = Column(Integer, primary_key=True)
    run_date = Column(DateTime, default=func.current_timestamp())
    duration_sec = Column(Float)
    processed_domains = Column(Integer)
    created_at = Column(DateTime, default=func.current_timestamp())
