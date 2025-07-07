# 🌐 Domain Tracker Frontend

Kullanıcı dostu arayüzü ile domain süresi takibi yapmanızı ve zamanında bildirim almanızı sağlayan modern frontend uygulaması.

---

## 📌 Proje Amacı

Bu uygulama, kullanıcıların domainlerini ekleyerek süresinin dolup dolmadığını takip edebileceği ve önceden bildirim alabileceği bir platform sunar. Backend API ile entegre çalışır.

---

## 🚀 Özellikler

- ✅ JWT tabanlı kullanıcı kayıt ve giriş sistemi
- ✅ Domain ekleme, silme, güncelleme ve listeleme
- ✅ WHOIS verilerini görüntüleme
- ✅ Domain süresi yaklaşınca otomatik bildirim alma
- ✅ Bildirim ayarlarını yapılandırma (gün sayısı, tür)
- ✅ Kullanıcı dostu dashboard ve formlar
- ✅ Modern tasarım ve responsive yapı

---

## 💻 Kullanılan Teknolojiler

| Teknoloji        | Açıklama                                     |
|------------------|----------------------------------------------|
| **React**        | SPA yapısı için ana frontend kütüphanesi     |
| **Vite**         | Hızlı geliştirme ortamı ve build işlemleri   |
| **Axios**        | Backend API ile iletişim                     |
| **React Router** | Sayfa yönlendirmesi                          |
| **Heroicons**    | Görsel ikon bileşenleri                      |

---



> 📝Ekran görüntüleri için: `screenshots.pdf` dosyasına bakabilirsiniz.

---

## ⚙️ Kurulum Adımları

```bash
git clone https://github.com/kullaniciadi/domain-tracker-frontend.git
cd domain-tracker-frontend
npm install
npm run dev
---

## 🌍 API Bağlantısı

`src/services/api.js` gibi bir dosyada backend URL’yi belirtin:

```
```js
const BASE_URL = "http://localhost:8000"; // veya production URL
export default BASE_URL;
```
## 📝 Notlar

- Bu proje sadece **frontend arayüzünü** kapsar.
- Backend tarafı için ilgili proje: [Domain Tracker Backend](https://github.com/InternshipProject01/domain_tracker/tree/main)
- API bağlantı ayarlarını `.env` dosyasına veya `src/services/api.js` içine uygun şekilde eklemeniz gerekir.

