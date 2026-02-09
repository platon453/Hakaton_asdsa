// PayKeeper API клиент

interface PayKeeperConfig {
  server: string
  secret: string
  user?: string
  password?: string
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
  invoiceId?: string
}

class PayKeeperClient {
  private config: PayKeeperConfig

  constructor() {
    this.config = {
      server: process.env.PAYKEEPER_SERVER || 'demo.paykeeper.ru',
      secret: process.env.PAYKEEPER_SECRET || 'demo_secret',
      user: process.env.PAYKEEPER_USER,
      password: process.env.PAYKEEPER_PASSWORD,
      mode: (process.env.PAYKEEPER_MODE as 'demo' | 'production') || 'demo',
    }
  }

  /**
   * Создание ссылки на оплату
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

    // В DEMO режиме возвращаем тестовую ссылку
    if (this.config.mode === 'demo') {
      const demoUrl = this.generateDemoPaymentUrl({
        orderId,
        amount,
        clientEmail,
        serviceName,
      })

      console.log('📝 PayKeeper DEMO: создана тестовая ссылка на оплату', {
        orderId,
        amount,
        url: demoUrl,
      })

      return {
        url: demoUrl,
        invoiceId: `demo_${orderId}`,
      }
    }

    // Production режим - реальный PayKeeper API
    try {
      const formData = new URLSearchParams({
        sum: amount.toFixed(2),
        orderid: orderId,
        service_name: serviceName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_name: clientName,
      })

      const response = await fetch(`https://${this.config.server}/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        throw new Error(`PayKeeper API error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        url: data.invoice_url || `https://${this.config.server}/bill/${data.invoice_id}/`,
        invoiceId: data.invoice_id,
      }
    } catch (error) {
      console.error('PayKeeper API error:', error)
      throw new Error('Ошибка при создании ссылки на оплату')
    }
  }

  /**
   * Генерация DEMO ссылки на оплату
   */
  private generateDemoPaymentUrl(params: {
    orderId: string
    amount: number
    clientEmail: string
    serviceName: string
  }): string {
    const { orderId, amount, clientEmail, serviceName } = params

    // Генерируем URL с параметрами для демо-страницы
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const queryParams = new URLSearchParams({
      order_id: orderId,
      amount: amount.toString(),
      email: clientEmail,
      service: serviceName,
    })

    return `${baseUrl}/demo-payment?${queryParams.toString()}`
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
export type { CreatePaymentParams, PaymentResponse }
