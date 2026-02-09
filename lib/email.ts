// Email клиент для отправки уведомлений

import sgMail from '@sendgrid/mail'

interface EmailConfig {
  apiKey: string
  fromEmail: string
  fromName: string
  mode: 'demo' | 'production'
}

interface SendBookingConfirmationParams {
  to: string
  bookingId: string
  customerName: string
  excursionDate: string
  excursionTime: string
  adultTickets: number
  childTickets: number
  infantTickets: number
  totalAmount: number
  tariffName: string
}

class EmailClient {
  private config: EmailConfig

  constructor() {
    this.config = {
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: process.env.EMAIL_FROM || 'noreply@lulu-alpaca.ru',
      fromName: 'Ферма альпак ЛуЛу',
      mode: (process.env.EMAIL_MODE as 'demo' | 'production') || 'demo',
    }

    // Инициализируем SendGrid только если есть API ключ
    if (this.config.apiKey && this.config.mode === 'production') {
      sgMail.setApiKey(this.config.apiKey)
    }
  }

  /**
   * Проверка что Email настроен
   */
  isConfigured(): boolean {
    if (this.config.mode === 'demo') {
      return true // В DEMO режиме всегда готов
    }
    return !!this.config.apiKey
  }

  /**
   * Отправка подтверждения бронирования
   */
  async sendBookingConfirmation(params: SendBookingConfirmationParams): Promise<void> {
    const {
      to,
      bookingId,
      customerName,
      excursionDate,
      excursionTime,
      adultTickets,
      childTickets,
      infantTickets,
      totalAmount,
      tariffName,
    } = params

    const subject = `Подтверждение бронирования #${bookingId.slice(0, 8).toUpperCase()} - Ферма ЛуЛу 🦙`
    const html = this.buildBookingConfirmationHTML(params)

    // В DEMO режиме просто логируем
    if (this.config.mode === 'demo') {
      console.log('📧 Email DEMO: отправлено подтверждение бронирования', {
        to,
        subject,
        bookingId,
        preview: html.substring(0, 100) + '...',
      })
      
      // Сохраняем в файл для просмотра (опционально)
      await this.saveDemoEmail(to, subject, html)
      return
    }

    // Production режим - отправка через SendGrid
    try {
      const msg = {
        to,
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        subject,
        html,
        text: this.buildBookingConfirmationText(params), // Текстовая версия
      }

      await sgMail.send(msg)
      console.log('✅ Email отправлен:', to)
    } catch (error: any) {
      console.error('❌ Ошибка отправки email:', error.response?.body || error.message)
      throw new Error('Не удалось отправить email')
    }
  }

  /**
   * Построение HTML письма с подтверждением
   */
  private buildBookingConfirmationHTML(params: SendBookingConfirmationParams): string {
    const {
      bookingId,
      customerName,
      excursionDate,
      excursionTime,
      adultTickets,
      childTickets,
      infantTickets,
      totalAmount,
      tariffName,
    } = params

    const totalTickets = adultTickets + childTickets + infantTickets
    const bookingNumber = bookingId.slice(0, 8).toUpperCase()

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Подтверждение бронирования</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #22c55e;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #22c55e;
      margin: 0;
      font-size: 28px;
    }
    .emoji {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .booking-number {
      background-color: #f0fdf4;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      margin: 20px 0;
    }
    .booking-number strong {
      color: #22c55e;
      font-size: 24px;
    }
    .details {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .details h3 {
      margin-top: 0;
      color: #1f2937;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6b7280;
    }
    .detail-value {
      font-weight: 600;
      color: #1f2937;
    }
    .total {
      background-color: #22c55e;
      color: white;
      padding: 15px 20px;
      border-radius: 6px;
      text-align: center;
      margin: 20px 0;
    }
    .total-amount {
      font-size: 32px;
      font-weight: bold;
    }
    .info-box {
      background-color: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box h4 {
      margin-top: 0;
      color: #1e40af;
    }
    .info-box ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .info-box li {
      color: #1e3a8a;
      margin: 5px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #22c55e;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji">🦙</div>
      <h1>Спасибо за бронирование!</h1>
      <p>Ферма альпак ЛуЛу</p>
    </div>

    <p>Здравствуйте, ${customerName}!</p>
    <p>Ваше бронирование успешно оплачено. Ждём вас на нашей ферме!</p>

    <div class="booking-number">
      <div>Номер бронирования</div>
      <strong>${bookingNumber}</strong>
    </div>

    <div class="details">
      <h3>📅 Детали визита</h3>
      <div class="detail-row">
        <span class="detail-label">Дата</span>
        <span class="detail-value">${excursionDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Время</span>
        <span class="detail-value">${excursionTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Тариф</span>
        <span class="detail-value">${tariffName}</span>
      </div>
    </div>

    <div class="details">
      <h3>🎟️ Билеты</h3>
      ${adultTickets > 0 ? `<div class="detail-row">
        <span class="detail-label">Взрослые билеты</span>
        <span class="detail-value">${adultTickets}</span>
      </div>` : ''}
      ${childTickets > 0 ? `<div class="detail-row">
        <span class="detail-label">Детские билеты</span>
        <span class="detail-value">${childTickets}</span>
      </div>` : ''}
      ${infantTickets > 0 ? `<div class="detail-row">
        <span class="detail-label">Дети до 3 лет</span>
        <span class="detail-value">${infantTickets}</span>
      </div>` : ''}
      <div class="detail-row">
        <span class="detail-label">Всего билетов</span>
        <span class="detail-value">${totalTickets}</span>
      </div>
    </div>

    <div class="total">
      <div>Оплачено</div>
      <div class="total-amount">${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(totalAmount)}</div>
    </div>

    <div class="info-box">
      <h4>📍 Как добраться</h4>
      <p><strong>Адрес:</strong> Московская область, Сергиево-Посадский район, деревня Лучки</p>
      <p><strong>Координаты:</strong> 56.234567, 38.123456</p>
    </div>

    <div class="info-box">
      <h4>💡 Полезная информация</h4>
      <ul>
        <li>Приезжайте за 10-15 минут до начала экскурсии</li>
        <li>Возьмите с собой воду и удобную обувь</li>
        <li>Можно взять угощение для альпак (морковь, яблоки)</li>
        <li>Продолжительность экскурсии: ~1.5 часа</li>
        <li>Фотосессия с альпаками включена</li>
      </ul>
    </div>

    <div class="info-box">
      <h4>📞 Контакты</h4>
      <p>Телефон: <a href="tel:+79001234567">+7 (900) 123-45-67</a></p>
      <p>Email: <a href="mailto:info@lulu-alpaca.ru">info@lulu-alpaca.ru</a></p>
      <p>Сайт: <a href="https://lulu-alpaca.ru">lulu-alpaca.ru</a></p>
    </div>

    <div class="footer">
      <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
      <p>Ферма альпак ЛуЛу © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Построение текстовой версии письма
   */
  private buildBookingConfirmationText(params: SendBookingConfirmationParams): string {
    const {
      bookingId,
      customerName,
      excursionDate,
      excursionTime,
      adultTickets,
      childTickets,
      infantTickets,
      totalAmount,
      tariffName,
    } = params

    const totalTickets = adultTickets + childTickets + infantTickets
    const bookingNumber = bookingId.slice(0, 8).toUpperCase()

    return `
ПОДТВЕРЖДЕНИЕ БРОНИРОВАНИЯ - ФЕРМА АЛЬПАК ЛУЛУ

Здравствуйте, ${customerName}!

Ваше бронирование успешно оплачено. Ждём вас на нашей ферме!

НОМЕР БРОНИРОВАНИЯ: ${bookingNumber}

ДЕТАЛИ ВИЗИТА:
- Дата: ${excursionDate}
- Время: ${excursionTime}
- Тариф: ${tariffName}

БИЛЕТЫ:
${adultTickets > 0 ? `- Взрослые: ${adultTickets}\n` : ''}${childTickets > 0 ? `- Детские: ${childTickets}\n` : ''}${infantTickets > 0 ? `- Дети до 3 лет: ${infantTickets}\n` : ''}- Всего: ${totalTickets}

ОПЛАЧЕНО: ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(totalAmount)}

КАК ДОБРАТЬСЯ:
Адрес: Московская область, Сергиево-Посадский район, деревня Лучки

ПОЛЕЗНАЯ ИНФОРМАЦИЯ:
- Приезжайте за 10-15 минут до начала
- Возьмите воду и удобную обувь
- Можно взять угощение для альпак (морковь, яблоки)
- Продолжительность: ~1.5 часа
- Фотосессия включена

КОНТАКТЫ:
Телефон: +7 (900) 123-45-67
Email: info@lulu-alpaca.ru
Сайт: lulu-alpaca.ru

--
Ферма альпак ЛуЛу © ${new Date().getFullYear()}
    `.trim()
  }

  /**
   * Сохранение DEMO email в консоль и файл
   */
  private async saveDemoEmail(to: string, subject: string, html: string): Promise<void> {
    console.log('\n═══════════════════════════════════════════════════════')
    console.log('📧 DEMO EMAIL')
    console.log('═══════════════════════════════════════════════════════')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log('═══════════════════════════════════════════════════════\n')
  }
}

// Экспортируем singleton
export const emailClient = new EmailClient()

// Типы для использования
export type { SendBookingConfirmationParams }
