import smtplib
from email.mime.text import MIMEText
from settings import SMTP_SERVER, SMTP_PORT, SENDER_EMAIL, SENDER_PASSWORD

def send_email(message, to_email, subject="Domain Notification"):
    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
