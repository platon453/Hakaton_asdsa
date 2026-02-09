# 📧 Настройка Email через SMTP (без SendGrid)

## ✅ Преимущества SMTP:
- **Бесплатно** - используете свою почту
- **Просто** - не нужна регистрация в сторонних сервисах
- **Быстро** - настройка за 5 минут

---

## 🎯 Вариант 1: Gmail (рекомендуется)

### Шаг 1: Включите 2-факторную аутентификацию
1. Откройте https://myaccount.google.com/security
2. Включите "Двухэтапная аутентификация"

### Шаг 2: Создайте пароль приложения
1. Откройте https://myaccount.google.com/apppasswords
2. Выберите "Почта" и "Другое устройство"
3. Введите название: "Lulu Booking"
4. Скопируйте сгенерированный пароль (16 символов)

### Шаг 3: Настройте .env
```env
EMAIL_MODE="production"
EMAIL_PROVIDER="smtp"
EMAIL_FROM="your-email@gmail.com"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"  # Пароль приложения из шага 2
```

### Шаг 4: Перезапустите сервер
```bash
# Остановите npm run dev (Ctrl+C)
npm run dev
```

### Шаг 5: Проверьте
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com"}'
```

Письмо должно прийти на вашу почту! 🎉

---

## 📮 Вариант 2: Yandex

```env
EMAIL_MODE="production"
EMAIL_PROVIDER="smtp"
EMAIL_FROM="your-email@yandex.ru"

SMTP_HOST="smtp.yandex.ru"
SMTP_PORT="587"
SMTP_USER="your-email@yandex.ru"
SMTP_PASSWORD="your-password"
```

---

## 📬 Вариант 3: Mail.ru

```env
EMAIL_MODE="production"
EMAIL_PROVIDER="smtp"
EMAIL_FROM="your-email@mail.ru"

SMTP_HOST="smtp.mail.ru"
SMTP_PORT="587"
SMTP_USER="your-email@mail.ru"
SMTP_PASSWORD="your-password"
```

---

## 📤 Вариант 4: Другой SMTP сервер

```env
EMAIL_MODE="production"
EMAIL_PROVIDER="smtp"
EMAIL_FROM="your-email@example.com"

SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"  # Или 465 для SSL
SMTP_USER="your-username"
SMTP_PASSWORD="your-password"
```

---

## 🧪 Тестирование

### 1. Проверить статус
```bash
curl http://localhost:3000/api/email/status
```

Должно быть:
```json
{
  "status": "active",
  "configured": true,
  "mode": "production",
  "provider": "smtp"
}
```

### 2. Отправить тестовое письмо
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 3. Создать бронирование и проверить email
1. Откройте http://localhost:3000/booking
2. Создайте бронирование
3. Пройдите до конца (DEMO оплата)
4. Письмо должно прийти на указанный email!

---

## ⚠️ Частые проблемы

### Gmail: "Less secure app access"
**Решение:** Используйте пароль приложения (App Password), а не основной пароль

### Ошибка "Invalid login"
**Решение:** Проверьте правильность email и пароля в .env

### Письма не приходят
**Решение:** 
1. Проверьте папку "Спам"
2. Убедитесь что EMAIL_MODE="production"
3. Проверьте логи сервера

---

## 🔄 Переключение между SendGrid и SMTP

### Использовать SendGrid:
```env
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG.your-key"
```

### Использовать SMTP:
```env
EMAIL_PROVIDER="smtp"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"
```

---

## ✅ Готово!

Теперь письма будут отправляться через обычную почту без сторонних сервисов!
