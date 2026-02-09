# Настройка Email (SendGrid) для Production

## Шаг 1: Получение API ключа SendGrid

1. Зарегистрируйтесь на https://sendgrid.com
2. Создайте API ключ:
   - Settings → API Keys → Create API Key
   - Выберите "Full Access"
   - Скопируйте ключ (показывается только один раз!)

## Шаг 2: Настройка переменных окружения

Добавьте в `.env`:

```env
# Email (SendGrid Production)
EMAIL_MODE="production"
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@lulu-alpaca.ru"
```

## Шаг 3: Верификация домена (опционально)

Для лучшей доставляемости:
1. В SendGrid → Settings → Sender Authentication
2. Добавьте свой домен
3. Добавьте DNS записи как указано

## Шаг 4: Тестирование

```bash
# Проверить статус
curl http://localhost:3000/api/email/status

# Отправить тестовое письмо
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com"}'
```

## DEMO режим

В DEMO режиме письма не отправляются, а выводятся в консоль:
- Удобно для разработки и тестирования
- Не требует API ключа
- Показывает превью письма в логах

## Переключение режимов

```env
# DEMO (по умолчанию)
EMAIL_MODE="demo"

# Production (реальная отправка)
EMAIL_MODE="production"
SENDGRID_API_KEY="ваш_ключ"
```

