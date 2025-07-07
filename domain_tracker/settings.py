import os
from dotenv import load_dotenv


load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "localhost")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "noreply@example.com")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")
