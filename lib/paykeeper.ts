// PayKeeper API клиент (переписано с Python)

interface PayKeeperConfig {
  server: string
  user: string
  password: string
  mode: 'demo' | 'production'
}

interface CreatePaymentParams {
  orderId: string
  amount: number
  clientEmail: string
  clientPhone: string
  clientName: string
  serviceName?: string
}

interface PaymentResponse {
  url: string
  invoiceId: string
}

interface PaymentStatus {
  status: string
  invoiceId: string
}

class PayKeeperClient {
  private config: PayKeeperConfig

  constructor() {
    const server = process.env.PAYKEEPER_SERVER || 'demo.paykeeper.ru'
    // Добавляем https:// если не указан протокол
    const serverUrl = server.startsWith('http') ? server : `https://${server}`
    
    this.config = {
      server: serverUrl,
      user: process.env.PAYKEEPER_USER || 'demo',
      password: process.env.PAYKEEPER_PASSWORD || 'demo',
      mode: (process.env.PAYKEEPER_MODE as 'demo' | 'production') || 'demo',
    }
  }

  /**
   * Создание Basic Authorization header
   */
  private getAuthHeader(): string {
    const credentials = `${this.config.user}:${this.config.password}`
    const base64Credentials = Buffer.from(credentials).toString('base64')
    return `Basic ${base64Credentials}`
  }

  /**
   * Создание ссылки на оплату (по логике из pykeeperGen.py)
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    const {
      orderId,
      amount,
      clientEmail,
      clientPhone,
      clientName,
      serviceName = 'Экскурсия на ферму альпак ЛуЛу',
    } = params
    console.log(this.config.server);
    console.log("Я люблю жс");
    try {
      // Шаг 1: Получение токена безопасности
      const tokenResponse = await fetch(`${this.config.server}/info/settings/token/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.getAuthHeader(),
        },
      })

      if (!tokenResponse.ok) {
        throw new Error(`Failed to get token: ${tokenResponse.statusText}`)
      }

      const tokenData = await tokenResponse.json()
      
      if (!tokenData.token) {
        throw new Error('Token not received from PayKeeper')
      }

      const token = tokenData.token

      // Шаг 2: Создание счёта (invoice)
      const paymentData = new URLSearchParams({
        pay_amount: amount.toFixed(2),
        clientid: clientName,
        orderid: orderId,
        client_email: clientEmail,
        service_name: serviceName,
        client_phone: clientPhone,
        token: token,
      })
      console.log(this.config.server)
      const invoiceResponse = await fetch(`${this.config.server}/change/invoice/preview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.getAuthHeader(),
        },
        body: paymentData.toString(),
      })

      if (!invoiceResponse.ok) {
        throw new Error(`Failed to create invoice: ${invoiceResponse.statusText}`)
      }

      const invoiceData = await invoiceResponse.json()

      if (!invoiceData.invoice_id) {
        throw new Error('Invoice ID not received from PayKeeper')
      }

      const invoiceId = invoiceData.invoice_id
      const paymentUrl = `${this.config.server}/bill/${invoiceId}/`

      console.log('✅ PayKeeper: создана ссылка на оплату', {
        orderId,
        amount,
        invoiceId,
        url: paymentUrl,
      })

      return {
        url: paymentUrl,
        invoiceId: invoiceId,
      }
    } catch (error) {
      console.error('❌ PayKeeper API error:', error)
      console.log(this.config.server)
      throw new Error('Ошибка при создании ссылки на оплату')
    }
  }

  /**
   * Проверка статуса оплаты (по логике из pykeeperCheckPay.py)
   */
  async checkPaymentStatus(invoiceId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(
        `${this.config.server}/info/invoice/byid/?id=${invoiceId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.getAuthHeader(),
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to check payment status: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.status) {
        throw new Error('Status field not found in PayKeeper response')
      }

      console.log('💳 PayKeeper: статус оплаты', {
        invoiceId,
        status: data.status,
      })

      return {
        status: data.status,
        invoiceId: invoiceId,
      }
    } catch (error) {
      console.error('❌ PayKeeper check status error:', error)
      throw new Error('Ошибка при проверке статуса оплаты')
    }
  }


  /**
   * Проверка подписи webhook от PayKeeper
   */
  verifyWebhookSignature(data: Record<string, any>, signature: string): boolean {
    // В DEMO режиме пропускаем проверку
    if (this.config.mode === 'demo') {
      console.log('📝 PayKeeper DEMO: пропускаем проверку подписи webhook')
      return true
    }

    // TODO: Реализовать проверку подписи для production
    // Обычно это MD5 или SHA256 хеш от конкатенации параметров + secret
    return true
  }

  /**
   * Обработка данных webhook
   */
  parseWebhookData(formData: FormData): {
    orderId: string
    status: string
    amount: number
    paymentId: string
  } | null {
    try {
      const orderId = formData.get('orderid')?.toString()
      const status = formData.get('status')?.toString()
      const amount = parseFloat(formData.get('sum')?.toString() || '0')
      const paymentId = formData.get('id')?.toString()

      if (!orderId || !status) {
        console.error('PayKeeper webhook: missing required fields')
        return null
      }

      return {
        orderId,
        status,
        amount,
        paymentId: paymentId || orderId,
      }
    } catch (error) {
      console.error('PayKeeper webhook parsing error:', error)
      return null
    }
  }
}

// Экспортируем singleton
export const paykeeper = new PayKeeperClient()

// Типы для использования
export type { CreatePaymentParams, PaymentResponse, PaymentStatus }
