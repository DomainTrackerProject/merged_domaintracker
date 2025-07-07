# 🌐 DomainTracker

Alan adlarınızı (domain) otomatik olarak takip eden, WHOIS verileriyle entegre çalışan, son kullanma tarihine göre bildirim gönderen bir takip ve uyarı sistemi.

---

## 🧾 İçindekiler
- [📘 Proje Açıklaması](#proje-açıklaması)
- [🎯 Proje Amacı](#proje-amacı)
- [🚀 Özellikler](#özellikler)
- [🧠 Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [🗂️ Proje Yapısı](#proje-yapısı)
- [⚙️ Kurulum](#kurulum)
- [📌 Notlar](#notlar)

---

## 📘 Proje Açıklaması

**DomainTracker**, kullanıcıların sahip oldukları domainleri kolayca takip edebilmesi ve bu domainlerin süresi dolmadan önce **otomatik bildirim** almasını sağlayan bir web uygulamasıdır.

Bu sistem, kullanıcıların domainlerini sisteme kaydetmesine, son kullanma tarihlerini kontrol etmesine ve **belirlenen günlerde otomatik olarak e-posta göndermesine** olanak tanır.

---

## 🎯 Proje Amacı

Kullanıcıların domainlerinin süresini **manuel olarak takip etme ihtiyacını ortadan kaldırmak**, domain süresi yaklaşan kullanıcılara **otomatik hatırlatmalar** göndererek süresi dolan domainleri engellemektir.

---

## 🚀 Özellikler

- 🔒 Kullanıcı kayıt ve JWT token ile kimlik doğrulama
- 🌐 Domain ekleme, güncelleme, silme ve WHOIS verisi ile birlikte saklama
- 📬 Belirli günler öncesinden otomatik e-posta bildirimi
- 📅 Apscheduler kullanarak günlük kontrol görevleri
- 💾 SQLAlchemy ile veritabanı yönetimi
- 📥 WHOIS verisi çekme ve loglama
- 📊 Cron job loglama

---

## 🧠 Kullanılan Teknolojiler

| Katman        | Teknoloji |
|---------------|-----------|
| Backend       | Python, FastAPI |
| Veritabanı    | SQLite (SQLAlchemy ORM) |
| Kimlik Doğrulama | JWT (via `jose`) |
| Şifreleme     | Passlib (bcrypt) |
| Bildirim      | SMTP üzerinden e-posta gönderimi |
| Görev Zamanlama | APScheduler |
| WHOIS Sorgusu | `python-whois` |
| Ortam Değişkenleri | `python-dotenv` |

---

## 🗂️ Proje Yapısı
```

domain_tracker/
│
├── main.py                            # FastAPI uygulamasının giriş noktası
├── database.py                        # SQLAlchemy veritabanı bağlantısı ve session yönetimi
├── models.py                          # Veritabanı modelleri (User, Domain, Notification vs.)
├── alembic.ini                        # Alembic ayar dosyası (opsiyonel migration yönetimi için)
├── celery_app.py                      # Celery yapılandırma dosyası (opsiyonel görev kuyruğu için)
├── cron_tasks.py                      # Zamanlanmış görevler için cronjob tanımları
├── scheduler.py                       # APScheduler ile bildirim zamanlaması
├── settings.py                        # Ortam değişkenleri ve yapılandırmalar
├── Dockerfile.backend                 # Backend için Dockerfile (deploy işlemleri için)
│
├── routers/                           # FastAPI router dosyaları
│   ├── auth.py
│   ├── domain.py
│   ├── notification.py
│   ├── notification_day.py
│   ├── notification_type.py
│   ├── cron_log.py
│   ├── whois_log.py
│   ├── domain_notification_setting.py
│
├── utils/                             # Yardımcı fonksiyonlar
│   ├── email_sender.py               # SMTP üzerinden e-posta gönderimi
│
├── tasks/                             # Celery veya zamanlanmış görevler için task modülleri
│   ├── notification_tasks/           # Bildirim ile ilgili görev tanımları
│
├── .env                               # Ortam değişkenlerini içeren gizli ayar dosyası
└── requirements.txt                   # Proje bağımlılıklarını içeren dosya

```

---

## ⚙️ Kurulum

```bash
# Projeyi klonla
git clone https://github.com/kullaniciadi/DomainTracker.git
cd DomainTracker

# Sanal ortam oluştur ve aktif et
python -m venv .venv
.venv\Scripts\activate   # Windows

# Gereksinimleri yükle
pip install -r requirements.txt

# .env dosyasını oluştur ve SMTP bilgilerini gir
cp .env.example .env

# Uygulamayı başlat
uvicorn domain_tracker.main:app --reload

```
## 📝 Notlar

- Bu proje sadece **backend kodlarını** kapsar.
- Frontend tarafı için ilgili proje: [Domain Tracker Frontend]([https://github.com/MirayTepe/domain-tracker-backend](https://github.com/InternshipProject01/domain_tracker_frontend))


