# 🚀 MVP План: Быстрый прототип системы бронирования

## Концепция MVP (Minimum Viable Product)

**Цель:** Создать работающий прототип за минимальное время (~12-16 часов) без внешних интеграций, но с полным функционалом бронирования.

**Что ВКЛЮЧЕНО:**
- ✅ Полноценный календарь бронирования
- ✅ Форма бронирования с валидацией
- ✅ База данных с реальными данными
- ✅ **ДЕМО интеграция с PayKeeper** (тестовый режим)
- ✅ **ДЕМО интеграция с AmoCRM** (создание контактов и сделок)
- ✅ **Продакшен Email** (SendGrid или реальный SMTP)
- ✅ Базовая админка для управления
- ✅ Полный цикл бронирования от начала до конца

**Что ИСКЛЮЧЕНО:**
- ❌ Сложная аутентификация (JWT, OAuth и т.д.) - простой логин/пароль для админки
- ❌ Deploy на production сервер
- ❌ CI/CD pipeline
- ❌ Продвинутая аналитика и отчеты

---

## 🎯 Обновленная цель MVP

Создать **полнофункциональный прототип** за ~18-22 часа с реальными интеграциями в ДЕМО режиме, готовый к презентации на хакатоне.

---

## 📋 Детальные этапы MVP

### **Этап 1: Фундамент и настройка проекта**
**Время:** ~2 часа

#### Что создаем:
- ✅ Next.js 14 + TypeScript проект
- ✅ Tailwind CSS + shadcn/ui
- ✅ Docker Compose для PostgreSQL
- ✅ Prisma ORM setup
- ✅ Базовая структура папок

#### Файлы:
```
lulu-booking/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── docker-compose.yml
├── .env.example
├── prisma/schema.prisma
└── app/
    ├── layout.tsx
    └── page.tsx
```

#### Проверка:
```bash
npm run dev
# → localhost:3000 открывается
```

---

### **Этап 2: База данных + Backend API**
**Время:** ~3 часа

#### Что создаем:
- ✅ Полная Prisma схема (User, Slot, Booking, Tariff)
- ✅ Миграции
- ✅ API Routes:
  - `GET /api/slots` - список слотов
  - `POST /api/bookings` - создание бронирования
  - `GET /api/tariffs` - получение тарифов
- ✅ Seed скрипт с тестовыми данными

#### Ключевые функции:
```typescript
// Расчет стоимости
function calculateBookingTotal(tariff, tickets) {
  return (
    tariff.adultPrice * tickets.adult +
    tariff.childPrice * tickets.child +
    tariff.infantPrice * tickets.infant
  );
}

// Проверка доступности
function checkSlotAvailability(slot, ticketsCount) {
  return slot.availableCapacity >= ticketsCount;
}
```

#### Проверка:
```bash
npx prisma migrate dev
npx prisma db seed
curl http://localhost:3000/api/slots
# → JSON со слотами
```

---

### **Этап 3: Frontend - Календарь и выбор слотов**
**Время:** ~4 часа

#### Что создаем:
- ✅ Компонент календаря
- ✅ Карточки слотов с индикацией загруженности
- ✅ Главная страница
- ✅ State management (React Context или Zustand)

#### Компоненты:
```tsx
components/booking/
├── BookingCalendar.tsx    // Календарь с датами
├── SlotCard.tsx           // Карточка слота
│   // Показывает: время, свободные места, цену
├── SlotList.tsx           // Список слотов на дату
└── AvailabilityBadge.tsx  // Бейдж "Свободно X из Y"
```

#### UI особенности:
- 🟢 Зеленый - много мест (>50%)
- 🟡 Желтый - мало мест (10-50%)
- 🔴 Красный/серый - занято (<10%)
- Клик на слот → переход к форме бронирования

#### Проверка:
- Видим календарь
- Клик на дату → видим слоты
- Индикация загруженности работает

---

### **Этап 4: Frontend - Форма бронирования**
**Время:** ~4 часа

#### Что создаем:
- ✅ Многошаговая форма бронирования
- ✅ React Hook Form + Zod валидация
- ✅ Динамический расчет суммы
- ✅ Страница подтверждения

#### Шаги формы:

**Шаг 1: Выбор билетов**
```tsx
<TicketSelector>
  Взрослый (1500₽) [- 2 +]
  Детский (800₽)   [- 1 +]
  До 3 лет (0₽)    [- 0 +]
  
  Итого: 3800₽
</TicketSelector>
```

**Шаг 2: Контактные данные**
```tsx
<ContactForm>
  Имя: [_________]
  Телефон: +7 (___) ___-__-__
  Email: [_________]
  
  ☑ Согласен с офертой
  ☑ Согласен на обработку ПД
</ContactForm>
```

**Шаг 3: Подтверждение**
```tsx
<BookingSummary>
  Дата: 15 февраля 2024
  Время: 14:00
  Билеты: 2 взрослых, 1 детский
  Сумма: 3800₽
  
  [Забронировать и оплатить]
</BookingSummary>
```

#### Валидация (Zod):
```typescript
const bookingSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Неверный формат'),
  email: z.string().email('Неверный email'),
  tickets: z.object({
    adult: z.number().min(0).max(10),
    child: z.number().min(0).max(10),
    infant: z.number().min(0).max(10)
  }).refine(t => t.adult + t.child + t.infant > 0, {
    message: 'Выберите хотя бы один билет'
  }),
  agreements: z.object({
    offer: z.literal(true),
    personalData: z.literal(true)
  })
});
```

#### Проверка:
- Форма валидируется в реальном времени
- Сумма пересчитывается при изменении билетов
- Нельзя отправить без согласий

---

### **Этап 5: ДЕМО Интеграция PayKeeper**
**Время:** ~3 часа

#### Что создаем:
- ✅ `lib/paykeeper.ts` - клиент для PayKeeper API
- ✅ Генерация ссылки на оплату (тестовый режим)
- ✅ Webhook обработчик для уведомлений об оплате
- ✅ Страница "Спасибо за оплату"

#### Реализация:

**1. Генерация платежа**
```typescript
// lib/paykeeper.ts
export async function createPayment(booking: Booking) {
  const params = new URLSearchParams({
    sum: booking.totalAmount.toString(),
    orderid: booking.id,
    service_name: 'Экскурсия на ферму альпак',
    client_email: booking.user.email,
    client_phone: booking.user.phone,
    client_name: booking.user.name
  });
  
  // В ДЕМО режиме используем sandbox PayKeeper
  const paymentUrl = `https://demo.paykeeper.ru/create/?${params}`;
  
  return paymentUrl;
}
```

**2. Webhook обработчик**
```typescript
// app/api/payments/webhook/route.ts
export async function POST(req: Request) {
  const data = await req.formData();
  const orderId = data.get('orderid');
  const status = data.get('status');
  
  if (status === 'success') {
    // Обновить статус бронирования
    await prisma.booking.update({
      where: { id: orderId },
      data: { 
        status: 'PAID',
        paidAt: new Date()
      }
    });
    
    // Отправить email
    await sendConfirmationEmail(orderId);
    
    // Обновить AmoCRM
    await updateAmoCRMDeal(orderId, 'PAID');
  }
  
  return new Response('OK');
}
```

**3. Страница благодарности**
```tsx
// app/thank-you/page.tsx
export default function ThankYouPage() {
  return (
    <div className="text-center py-12">
      <h1>Спасибо за оплату! 🎉</h1>
      <p>
        Чек оплаты, подтверждение бронирования и памятка 
        высланы на {email}
      </p>
      <BookingDetails />
    </div>
  );
}
```

#### Настройка тестового режима:
```env
# .env
PAYKEEPER_MODE=demo
PAYKEEPER_SERVER=demo.paykeeper.ru
PAYKEEPER_SECRET=demo_secret
```

#### Проверка:
- После "Забронировать" получаем ссылку PayKeeper
- Переход на тестовую страницу оплаты
- После "оплаты" → редирект на thank-you
- Статус в БД меняется на PAID

---

### **Этап 6: ДЕМО Интеграция AmoCRM**
**Время:** ~3 часа

#### Что создаем:
- ✅ `lib/amocrm.ts` - клиент для AmoCRM API v4
- ✅ OAuth авторизация (получить токены заранее)
- ✅ Создание/обновление контактов
- ✅ Создание сделки при бронировании
- ✅ Обновление сделки после оплаты
- ✅ Добавление события в календарь

#### Реализация:

**1. AmoCRM клиент**
```typescript
// lib/amocrm.ts
class AmoCRMClient {
  private baseUrl: string;
  private accessToken: string;
  
  constructor() {
    this.baseUrl = `https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4`;
    this.accessToken = process.env.AMOCRM_ACCESS_TOKEN;
  }
  
  async createContact(user: User) {
    const response = await fetch(`${this.baseUrl}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        name: user.name,
        custom_fields_values: [
          { field_id: 123456, values: [{ value: user.phone }] },
          { field_id: 123457, values: [{ value: user.email }] }
        ]
      }])
    });
    
    return await response.json();
  }
  
  async createDeal(booking: Booking, contactId: number) {
    const response = await fetch(`${this.baseUrl}/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        name: `Бронирование #${booking.id}`,
        price: booking.totalAmount,
        status_id: 12345, // ID этапа "Забронировано"
        pipeline_id: 67890,
        _embedded: {
          contacts: [{ id: contactId }]
        },
        custom_fields_values: [
          { 
            field_id: 111111, // Взрослые билеты
            values: [{ value: booking.adultTickets }] 
          },
          { 
            field_id: 111112, // Детские билеты
            values: [{ value: booking.childTickets }] 
          },
          { 
            field_id: 111113, // Дата экскурсии
            values: [{ value: booking.slot.date }] 
          },
          { 
            field_id: 111114, // Ссылка на оплату
            values: [{ value: booking.paymentLink }] 
          }
        ]
      }])
    });
    
    return await response.json();
  }
  
  async updateDealStatus(dealId: number, statusId: number) {
    await fetch(`${this.baseUrl}/leads/${dealId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status_id: statusId // ID этапа "Оплачено"
      })
    });
  }
}
```

**2. Интеграция в процесс бронирования**
```typescript
// app/api/bookings/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  
  // 1. Создать бронирование в БД
  const booking = await createBooking(data);
  
  // 2. Создать контакт в AmoCRM
  const amoCRM = new AmoCRMClient();
  const contact = await amoCRM.createContact(booking.user);
  
  // 3. Создать сделку
  const deal = await amoCRM.createDeal(booking, contact.id);
  
  // 4. Сохранить ID сделки
  await prisma.booking.update({
    where: { id: booking.id },
    data: { amocrmDealId: deal.id }
  });
  
  // 5. Создать ссылку на оплату
  const paymentLink = await createPayment(booking);
  
  return Response.json({ booking, paymentLink });
}
```

#### Настройка:
```env
# .env
AMOCRM_SUBDOMAIN=your-subdomain
AMOCRM_CLIENT_ID=your-client-id
AMOCRM_CLIENT_SECRET=your-secret
AMOCRM_ACCESS_TOKEN=your-access-token
AMOCRM_REFRESH_TOKEN=your-refresh-token

# ID кастомных полей (получить из AmoCRM)
AMOCRM_FIELD_ADULT_TICKETS=111111
AMOCRM_FIELD_CHILD_TICKETS=111112
AMOCRM_FIELD_EXCURSION_DATE=111113
AMOCRM_FIELD_PAYMENT_LINK=111114
```

#### Проверка:
- После бронирования → в AmoCRM появляется контакт
- В AmoCRM создается сделка в этапе "Забронировано"
- После оплаты → сделка переходит в "Оплачено"

---

### **Этап 7: Продакшен Email (SendGrid)**
**Время:** ~2 часа

#### Что создаем:
- ✅ Интеграция с SendGrid
- ✅ Email шаблоны (HTML)
- ✅ Отправка после оплаты:
  - Подтверждение бронирования
  - Памятка посетителю
  - Чек оплаты

#### Реализация:

**1. SendGrid клиент**
```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendBookingConfirmation(booking: Booking) {
  const msg = {
    to: booking.user.email,
    from: 'noreply@lulu-alpaca.ru',
    subject: 'Подтверждение бронирования - Ферма альпак ЛуЛу',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h1>Спасибо за бронирование! 🦙</h1>
        
        <h2>Детали вашего визита:</h2>
        <ul>
          <li><strong>Дата:</strong> ${formatDate(booking.slot.date)}</li>
          <li><strong>Время:</strong> ${formatTime(booking.slot.time)}</li>
          <li><strong>Билеты:</strong> 
            ${booking.adultTickets} взрослых, 
            ${booking.childTickets} детских
          </li>
          <li><strong>Сумма:</strong> ${booking.totalAmount}₽</li>
        </ul>
        
        <h2>Памятка:</h2>
        <ul>
          <li>Приезжайте за 10 минут до начала</li>
          <li>Возьмите с собой воду и солнцезащитный крем</li>
          <li>Можно взять угощение для альпак (морковь, яблоки)</li>
          <li>Адрес: Московская область, деревня Лучки</li>
        </ul>
        
        <p>До встречи на ферме!</p>
        <p>Команда ЛуЛу 🦙</p>
      </body>
      </html>
    `
  };
  
  await sgMail.send(msg);
}
```

**2. Интеграция в webhook**
```typescript
// app/api/payments/webhook/route.ts
if (status === 'success') {
  await prisma.booking.update({...});
  
  // Отправить email
  const booking = await prisma.booking.findUnique({
    where: { id: orderId },
    include: { user: true, slot: true }
  });
  
  await sendBookingConfirmation(booking);
}
```

#### Настройка:
```env
# .env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@lulu-alpaca.ru
```

#### Альтернатива (если нет SendGrid):
```typescript
// Использовать Nodemailer с Gmail SMTP
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
```

#### Проверка:
- После оплаты → email приходит на почту
- Письмо содержит все детали бронирования
- HTML форматирование корректное

---

### **Этап 8: Базовая админка**
**Время:** ~3-4 часа

#### Что создаем:
- ✅ Простая авторизация (логин/пароль в .env)
- ✅ Страница управления слотами
- ✅ Страница управления тарифами
- ✅ Просмотр бронирований
- ✅ Ручное редактирование

#### Структура:
```
app/admin/
├── login/
│   └── page.tsx           # Простая форма логина
├── layout.tsx             # Layout с навигацией
├── page.tsx               # Дашборд (статистика)
├── slots/
│   ├── page.tsx           # Список слотов
│   └── new/
│       └── page.tsx       # Создание слота
├── tariffs/
│   └── page.tsx           # Управление тарифами
└── bookings/
    └── page.tsx           # Список бронирований
```

#### Простая авторизация:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session');
    
    if (!session && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
}

// app/admin/login/page.tsx
async function handleLogin(username: string, password: string) {
  if (
    username === process.env.ADMIN_USERNAME && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // Установить cookie
    cookies().set('admin_session', 'authenticated', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 // 24 часа
    });
    
    redirect('/admin');
  }
}
```

#### Основные функции админки:

**1. Управление слотами**
```tsx
// app/admin/slots/page.tsx
export default function SlotsPage() {
  const slots = await prisma.slot.findMany({
    include: { tariff: true }
  });
  
  return (
    <div>
      <h1>Управление слотами</h1>
      <Button onClick={() => router.push('/admin/slots/new')}>
        Создать слот
      </Button>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Доступно мест</TableHead>
            <TableHead>Тариф</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots.map(slot => (
            <TableRow key={slot.id}>
              <TableCell>{formatDate(slot.date)}</TableCell>
              <TableCell>{formatTime(slot.time)}</TableCell>
              <TableCell>
                {slot.availableCapacity} / {slot.totalCapacity}
              </TableCell>
              <TableCell>{slot.tariff.name}</TableCell>
              <TableCell>
                <Button onClick={() => editSlot(slot.id)}>
                  Редактировать
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

**2. Просмотр бронирований**
```tsx
// app/admin/bookings/page.tsx
export default function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { user: true, slot: true },
    orderBy: { createdAt: 'desc' }
  });
  
  return (
    <div>
      <h1>Бронирования</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Дата экскурсии</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Билеты</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id.slice(0, 8)}</TableCell>
              <TableCell>
                {formatDate(booking.slot.date)} {formatTime(booking.slot.time)}
              </TableCell>
              <TableCell>
                {booking.user.name}<br/>
                {booking.user.phone}
              </TableCell>
              <TableCell>
                В: {booking.adultTickets}, 
                Д: {booking.childTickets}
              </TableCell>
              <TableCell>{booking.totalAmount}₽</TableCell>
              <TableCell>
                <Badge variant={booking.status === 'PAID' ? 'success' : 'warning'}>
                  {booking.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

#### Настройка:
```env
# .env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=hackathon2024
```

#### Проверка:
- Логин admin/hackathon2024 → доступ к админке
- Видим все слоты и бронирования
- Можем создать новый слот

---

## 📊 Итоговая таблица MVP

| Этап | Время | Функционал | Статус |
|------|-------|------------|--------|
| 1. Фундамент | 2ч | Проект + БД | ✅ Базовый |
| 2. Backend API | 3ч | API + логика | ✅ Полный |
| 3. Календарь | 4ч | Выбор слотов | ✅ Полный |
| 4. Форма | 4ч | Бронирование | ✅ Полный |
| 5. PayKeeper | 3ч | Оплата (демо) | ✅ ДЕМО |
| 6. AmoCRM | 3ч | CRM (демо) | ✅ ДЕМО |
| 7. Email | 2ч | SendGrid | ✅ Продакшен |
| 8. Админка | 3-4ч | Управление | ✅ Базовая |

**Общее время:** ~21-22 часа

---

## 🎯 Критерии готовности MVP

### Must Have (обязательно):
- ✅ Календарь работает, слоты отображаются
- ✅ Форма валидируется и создает бронирование
- ✅ Интеграция с PayKeeper (тестовый режим)
- ✅ Интеграция с AmoCRM (создание сделок)
- ✅ Email уведомления работают
- ✅ Админка позволяет управлять слотами
- ✅ Полный цикл: выбор → бронирование → оплата → подтверждение

### Should Have (желательно):
- ✅ Адаптивный дизайн
- ✅ Loading states
- ✅ Обработка ошибок
- ✅ Красивый UI

### Nice to Have (если успеем):
- ⭕ Система тарифов с расписанием
- ⭕ Webhook от PayKeeper работает в production
- ⭕ Повторная генерация ссылки на оплату

---

## 🚀 План запуска

### 1. Подготовка:
```bash
# Получить API ключи заранее:
- SendGrid API key
- AmoCRM access token (через OAuth или интеграцию)
- PayKeeper demo credentials
```

### 2. Разработка:
```bash
# День 1 (10 часов):
- Этапы 1-4: Фундамент + Backend + Frontend

# День 2 (8 часов):
- Этапы 5-6: Интеграции

# День 3 (4 часа):
- Этапы 7-8: Email + Админка + тестирование
```

### 3. Тестирование:
- Полный user flow от начала до конца
- Проверка всех интеграций
- Тестирование на мобильных

### 4. Презентация:
- Демо видео или живая демонстрация
- Показать полный цикл бронирования
- Показать админку

---

## 📝 Переменные окружения для MVP

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/lulu_booking"

# AmoCRM (ДЕМО)
AMOCRM_SUBDOMAIN="your-subdomain"
AMOCRM_ACCESS_TOKEN="your-access-token"
AMOCRM_FIELD_ADULT_TICKETS="111111"
AMOCRM_FIELD_CHILD_TICKETS="111112"
AMOCRM_FIELD_EXCURSION_DATE="111113"
AMOCRM_FIELD_PAYMENT_LINK="111114"

# PayKeeper (ДЕМО)
PAYKEEPER_MODE="demo"
PAYKEEPER_SERVER="demo.paykeeper.ru"
PAYKEEPER_SECRET="demo_secret"

# SendGrid (ПРОДАКШЕН)
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
EMAIL_FROM="noreply@lulu-alpaca.ru"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="hackathon2024"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ✅ Чеклист перед презентацией

### Функционал:
- [ ] Календарь показывает слоты
- [ ] Можно забронировать экскурсию
- [ ] Форма валидируется корректно
- [ ] Сумма рассчитывается правильно
- [ ] Ссылка на оплату генерируется
- [ ] В AmoCRM создается сделка
- [ ] Email приходит после "оплаты"
- [ ] Админка работает

### UI/UX:
- [ ] Адаптивный дизайн
- [ ] Нет критических багов
- [ ] Loading states показываются
- [ ] Ошибки обрабатываются

### Документация:
- [ ] README.md с инструкциями
- [ ] .env.example заполнен
- [ ] Комментарии в ключевых местах

---

## 🎉 Готово к хакатону!

Этот MVP план даёт тебе:
- ✅ Полный функционал бронирования
- ✅ Реальные интеграции в ДЕМО режиме
- ✅ Продакшен email рассылку
- ✅ Простую, но рабочую админку
- ✅ Готовое решение за ~22 часа

**Следующий шаг:** Начать разработку с Этапа 1? 🚀

