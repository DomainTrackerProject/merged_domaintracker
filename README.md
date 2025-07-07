# Domain Tracker

Domain Tracker, alan adı takibi, bildirim yönetimi ve otomatik görevler için geliştirilmiş bir tam yığın (full-stack) uygulamadır.

## Özellikler
- Alan adı ekleme, güncelleme ve silme
- Whois sorgulama ve loglama
- Bildirim günleri ve türleri yönetimi
- E-posta ile bildirim gönderimi
- Celery ile zamanlanmış görevler
- PostgreSQL veritabanı
- Redis ile kuyruk yönetimi
- Modern React tabanlı frontend
- Docker ile kolay kurulum

## Kurulum

### 1. Gerekli Yazılımlar
- Docker
- Docker Compose

### 2. Projeyi Klonlayın
```
git clone https://github.com/DomainTrackerProject/merged_domaintracker.git
cd merged_domaintracker
```

### 3. Ortam Değişkenlerini Ayarlayın
`domain_tracker/.env` dosyasını oluşturun ve gerekli değişkenleri girin.

### 4. Servisleri Başlatın
```
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

