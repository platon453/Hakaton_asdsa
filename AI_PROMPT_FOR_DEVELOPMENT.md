# Промпт для AI-разработки системы бронирования фермы альпак ЛуЛу

## Краткое описание задачи

Создай полнофункциональную систему бронирования и оплаты экскурсий на ферму альпак ЛуЛу (https://lulu-alpaca.ru/) для хакатона.

## Технологический стек

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui для UI компонентов
- React Hook Form + Zod для форм и валидации
- Axios для HTTP запросов

**Backend:**
- Node.js 18+ с Express.js
- TypeScript
- Prisma ORM
- PostgreSQL 15+

**Интеграции:**
- AmoCRM API v4 (создание контактов, сделок, события в календаре)
- PayKeeper API (прием платежей)
- Nodemailer (отправка email)

## Основной функционал

### 1. Клиентская часть (Пользовательский путь)

**Шаг 1: Календарь бронирования**
- Календарная сетка с доступными слотами
- Отображение для каждого слота:
  - Дата и время
  - "Свободно X мест из Y"
  - Цветовая индикация (зеленый - много мест, желтый - мало, серый - занято)
- Возможность выбрать один слот

**Шаг 2: Форма бронирования**
```typescript
interface BookingForm {
  // Контактные данные (обязательные)
  name: string;
  phone: string; // формат +7 (XXX) XXX-XX-XX
  email: string;
  
  // Билеты
  tickets: {
    adult: number;    // взрослый (0-10)
    child: number;    // детский (0-10)
    infant: number;   // до 3 лет, бесплатный (0-10)
  };
  
  // Согласия (обязательные)
  agreements: {
    offerAccepted: boolean;
    personalDataAccepted: boolean;
  };
}
```

- Динамический расчет суммы
- Проверка доступности мест в реальном времени
- Валидация всех полей

**Шаг 3: Подтверждение**
- Сводка бронирования
- Итоговая сумма
- Кнопка "Забронировать"

**Шаг 4: Оплата**
- Редирект на PayKeeper для оплаты
- После успешной оплаты → страница благодарности
- Автоматическая отправка email (чек, подтверждение, памятка)

### 2. Интеграция с AmoCRM

При нажатии "Забронировать":
1. Создать/обновить контакт в AmoCRM (имя, телефон, email)
2. Создать сделку в этапе "Забронировано" с полями:
   - Бюджет: сумма бронирования
   - Взрослые билеты: количество
   - Детские билеты: количество
   - Детские бесплатные билеты: количество
   - Дата экскурсии: дата и время слота
   - Ссылка на оплату PayKeeper
3. Добавить событие в календарь AmoCRM (статус "Забронировано")

При успешной оплате (webhook от PayKeeper):
- Обновить статус сделки в AmoCRM на "Оплачено"
- Обновить статус в календаре на "Оплачено"

### 3. Админ-панель

**Управление слотами:**
- CRUD операции для слотов
- Поля: дата, время, общее количество мест, тариф
- Возможность вручную изменить количество свободных мест
- Блокировка/разблокировка слотов

**Управление тарифами:**
- Создание тарифов с названием и ценами (взрослый, детский, детский бесплатный)
- Привязка тарифов к расписанию:
  - По дням недели (например, "Промо" по будням, "Стандарт" по выходным)
  - По конкретным датам
  - По временным слотам
  - Приоритеты применения

**Управление бронированиями:**
- Просмотр всех бронирований (таблица с фильтрацией)
- Редактирование данных бронирования
- Повторная генерация ссылки на оплату
- Отмена бронирования (с освобождением мест)

### 4. База данных (Prisma Schema)

```prisma
model User {
  id               String    @id @default(uuid())
  name             String
  phone            String
  email            String
  amocrmContactId  Int?
  bookings         Booking[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model Tariff {
  id          String    @id @default(uuid())
  name        String
  adultPrice  Decimal   @db.Decimal(10, 2)
  childPrice  Decimal   @db.Decimal(10, 2)
  infantPrice Decimal   @db.Decimal(10, 2) @default(0)
  description String?
  isActive    Boolean   @default(true)
  slots       Slot[]
  schedules   TariffSchedule[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Slot {
  id                String    @id @default(uuid())
  date              DateTime  @db.Date
  time              DateTime  @db.Time
  totalCapacity     Int
  availableCapacity Int
  tariffId          String
  tariff            Tariff    @relation(fields: [tariffId], references: [id])
  status            SlotStatus @default(ACTIVE)
  bookings          Booking[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

enum SlotStatus {
  ACTIVE
  BLOCKED
  FULL
}

model Booking {
  id            String        @id @default(uuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  slotId        String
  slot          Slot          @relation(fields: [slotId], references: [id])
  adultTickets  Int
  childTickets  Int
  infantTickets Int
  totalAmount   Decimal       @db.Decimal(10, 2)
  status        BookingStatus @default(PENDING)
  paymentLink   String?
  paymentId     String?
  amocrmDealId  Int?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  confirmedAt   DateTime?
  paidAt        DateTime?
}

enum BookingStatus {
  PENDING
  CONFIRMED
  PAID
  CANCELLED
}

model TariffSchedule {
  id           String    @id @default(uuid())
  tariffId     String
  tariff       Tariff    @relation(fields: [tariffId], references: [id])
  dayOfWeek    DayOfWeek?
  specificDate DateTime? @db.Date
  timeFrom     DateTime? @db.Time
  timeTo       DateTime? @db.Time
  priority     Int       @default(0)
  createdAt    DateTime  @default(now())
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}
```

### 5. API Endpoints

**Публичные:**
```
GET    /api/slots?date_from=2024-01-01&date_to=2024-01-31
GET    /api/slots/:id
POST   /api/bookings
POST   /api/payments/webhook (PayKeeper webhook)
```

**Административные (требуют аутентификации):**
```
GET    /api/admin/bookings
PATCH  /api/admin/bookings/:id
POST   /api/admin/bookings/:id/regenerate-payment
POST   /api/admin/slots
GET    /api/admin/slots
PATCH  /api/admin/slots/:id
DELETE /api/admin/slots/:id
GET    /api/admin/tariffs
POST   /api/admin/tariffs
PATCH  /api/admin/tariffs/:id
```

### 6. Структура проекта

```
lulu-booking/
├── frontend/                 # Next.js приложение
│   ├── app/
│   │   ├── page.tsx         # Главная страница с календарем
│   │   ├── booking/
│   │   │   └── page.tsx     # Страница бронирования
│   │   ├── thank-you/
│   │   │   └── page.tsx     # Страница благодарности
│   │   ├── admin/
│   │   │   ├── page.tsx     # Админ дашборд
│   │   │   ├── slots/
│   │   │   ├── bookings/
│   │   │   └── tariffs/
│   │   └── api/             # API Routes (Next.js API)
│   │       ├── slots/
│   │       ├── bookings/
│   │       └── admin/
│   ├── components/
│   │   ├── Calendar.tsx
│   │   ├── BookingForm.tsx
│   │   ├── SlotCard.tsx
│   │   └── admin/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── amocrm.ts
│   │   ├── paykeeper.ts
│   │   └── email.ts
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Ключевые требования к реализации

1. **Типобезопасность:** Используй TypeScript везде
2. **Валидация:** Zod схемы для всех форм и API запросов
3. **Обработка ошибок:** Try-catch блоки, понятные сообщения об ошибках
4. **Транзакции БД:** При бронировании используй транзакции Prisma
5. **Адаптивность:** Мобильная версия должна работать идеально
6. **Loading states:** Скелетоны и лоадеры во время загрузки
7. **Оптимистичные UI:** Мгновенная реакция на действия пользователя

## Примеры ключевых функций

### Создание бронирования (backend)

```typescript
async function createBooking(data: BookingInput) {
  return await prisma.$transaction(async (tx) => {
    // 1. Проверить доступность слота
    const slot = await tx.slot.findUnique({ where: { id: data.slotId } });
    const totalTickets = data.tickets.adult + data.tickets.child + data.tickets.infant;
    
    if (slot.availableCapacity < totalTickets) {
      throw new Error('Недостаточно свободных мест');
    }
    
    // 2. Создать/найти пользователя
    const user = await tx.user.upsert({
      where: { email: data.user.email },
      update: { name: data.user.name, phone: data.user.phone },
      create: data.user
    });
    
    // 3. Создать бронирование
    const booking = await tx.booking.create({
      data: {
        userId: user.id,
        slotId: data.slotId,
        adultTickets: data.tickets.adult,
        childTickets: data.tickets.child,
        infantTickets: data.tickets.infant,
        totalAmount: calculateTotal(slot.tariff, data.tickets)
      }
    });
    
    // 4. Обновить доступность слота
    await tx.slot.update({
      where: { id: data.slotId },
      data: { availableCapacity: { decrement: totalTickets } }
    });
    
    // 5. Создать контакт и сделку в AmoCRM
    const amocrmContact = await createAmoCRMContact(user);
    const amocrmDeal = await createAmoCRMDeal({
      contact: amocrmContact,
      booking,
      slot
    });
    
    // 6. Сгенерировать ссылку на оплату PayKeeper
    const paymentLink = await createPayKeeperPayment({
      orderId: booking.id,
      amount: booking.totalAmount,
      customer: user
    });
    
    // 7. Обновить бронирование с данными AmoCRM и PayKeeper
    return await tx.booking.update({
      where: { id: booking.id },
      data: {
        amocrmDealId: amocrmDeal.id,
        paymentLink
      }
    });
  });
}
```

### Календарь слотов (frontend)

```tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { SlotCard } from '@/components/SlotCard';

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: slots, isLoading } = useQuery({
    queryKey: ['slots', selectedDate],
    queryFn: () => fetchSlots(selectedDate)
  });
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Доступные слоты на {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
        </h3>
        
        {isLoading ? (
          <div>Загрузка...</div>
        ) : slots?.length === 0 ? (
          <p className="text-muted-foreground">На эту дату нет доступных слотов</p>
        ) : (
          slots?.map(slot => (
            <SlotCard 
              key={slot.id} 
              slot={slot} 
              onSelect={() => handleSlotSelect(slot)}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

## Переменные окружения (.env.example)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/lulu_booking"

# AmoCRM
AMOCRM_CLIENT_ID="your-client-id"
AMOCRM_CLIENT_SECRET="your-client-secret"
AMOCRM_REDIRECT_URI="http://localhost:3000/api/amocrm/callback"
AMOCRM_SUBDOMAIN="your-subdomain"
AMOCRM_ACCESS_TOKEN="your-access-token"
AMOCRM_REFRESH_TOKEN="your-refresh-token"

# PayKeeper
PAYKEEPER_SERVER="your-server.server.paykeeper.ru"
PAYKEEPER_SECRET="your-secret"
PAYKEEPER_USER="your-user"
PAYKEEPER_PASSWORD="your-password"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@lulu-alpaca.ru"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-for-admin"
```

## Docker Compose для разработки

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: lulu_booking
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/lulu_booking
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

## Инструкции по запуску

```bash
# 1. Клонировать репозиторий и установить зависимости
npm install

# 2. Создать .env файл
cp .env.example .env
# Заполнить необходимые переменные

# 3. Запустить PostgreSQL через Docker
docker-compose up -d postgres

# 4. Применить миграции
npx prisma migrate dev

# 5. (Опционально) Заполнить базу тестовыми данными
npx prisma db seed

# 6. Запустить dev сервер
npm run dev
```

## Критерии успеха для хакатона

✅ **Must Have:**
- Работающий календарь бронирования
- Форма с валидацией
- Создание бронирования в БД
- Интеграция с PayKeeper (хотя бы тестовая)
- Интеграция с AmoCRM (создание сделок)
- Email уведомления
- Базовая админ-панель

✅ **Should Have:**
- Система тарифов
- Адаптивный дизайн
- Обработка ошибок
- Loading states

🎁 **Nice to Have:**
- Полная админ-панель
- E2E тесты
- Production deployment

---

## Дополнительные подсказки

1. **Для календаря:** Используй библиотеку `react-day-picker` или `@fullcalendar/react`
2. **Для форм:** React Hook Form очень удобна с Zod
3. **Для таблиц в админке:** `@tanstack/react-table`
4. **Для уведомлений:** `sonner` или `react-hot-toast`
5. **Для модальных окон:** `@radix-ui/react-dialog` (входит в shadcn/ui)

**Начни с:**
1. Настройки Next.js проекта с TypeScript
2. Настройки Prisma и создания миграций
3. Создания базового календаря слотов
4. API endpoint для получения слотов
5. Формы бронирования

**Удачи! 🦙**
