// AmoCRM API клиент

interface AmoCRMConfig {
  subdomain: string
  accessToken: string
  refreshToken: string
  clientId: string
  clientSecret: string
  mode: 'demo' | 'production'
}

interface CreateContactParams {
  name: string
  phone: string
  email: string
}

interface CreateDealParams {
  name: string
  price: number
  contactId: number
  customFields: {
    adultTickets: number
    childTickets: number
    infantTickets: number
    excursionDate: string
    paymentLink: string
  }
}

interface AmoCRMContact {
  id: number
  name: string
}

interface AmoCRMDeal {
  id: number
  name: string
  status_id: number
}

class AmoCRMClient {
  private config: AmoCRMConfig
  private baseUrl: string

  constructor() {
    this.config = {
      subdomain: process.env.AMOCRM_SUBDOMAIN || '',
      accessToken: process.env.AMOCRM_ACCESS_TOKEN || '',
      refreshToken: process.env.AMOCRM_REFRESH_TOKEN || '',
      clientId: process.env.AMOCRM_CLIENT_ID || '',
      clientSecret: process.env.AMOCRM_CLIENT_SECRET || '',
      mode: (process.env.AMOCRM_MODE as 'demo' | 'production') || 'demo',
    }

    this.baseUrl = this.config.subdomain
      ? `https://${this.config.subdomain}.amocrm.ru/api/v4`
      : ''
  }

  /**
   * Проверка что AmoCRM настроен
   */
  isConfigured(): boolean {
    if (this.config.mode === 'demo') {
      return true // В DEMO режиме всегда готов
    }
    return !!(this.config.subdomain && this.config.accessToken)
  }

  /**
   * Создание или обновление контакта
   */
  async createOrUpdateContact(params: CreateContactParams): Promise<AmoCRMContact> {
    const { name, phone, email } = params

    // В DEMO режиме возвращаем фейковый контакт
    if (this.config.mode === 'demo') {
      const fakeId = Math.floor(Math.random() * 1000000)
      
      // Импортируем логгер
      const { amocrmLogger } = await import('./amocrm-logger')
      amocrmLogger.log('contact_created', {
        contactId: fakeId,
        name,
        phone,
        email,
        mode: 'demo',
      })

      return {
        id: fakeId,
        name,
      }
    }

    // Production режим - реальный AmoCRM API
    try {
      // Сначала ищем существующий контакт по email
      const searchUrl = `${this.baseUrl}/contacts?query=${encodeURIComponent(email)}`
      const searchResponse = await this.makeRequest(searchUrl, 'GET')

      let contactId: number

      if (searchResponse._embedded?.contacts?.length > 0) {
        // Контакт найден - обновляем
        contactId = searchResponse._embedded.contacts[0].id
        console.log('AmoCRM: контакт найден, обновляем', contactId)
      } else {
        // Создаем новый контакт
        const createData = [
          {
            name,
            custom_fields_values: [
              {
                field_code: 'PHONE',
                values: [{ value: phone, enum_code: 'WORK' }],
              },
              {
                field_code: 'EMAIL',
                values: [{ value: email, enum_code: 'WORK' }],
              },
            ],
          },
        ]

        const createResponse = await this.makeRequest(
          `${this.baseUrl}/contacts`,
          'POST',
          createData
        )

        contactId = createResponse._embedded.contacts[0].id
        console.log('AmoCRM: контакт создан', contactId)
      }

      return {
        id: contactId,
        name,
      }
    } catch (error) {
      console.error('AmoCRM: ошибка при создании контакта', error)
      throw new Error('Ошибка при работе с AmoCRM')
    }
  }

  /**
   * Создание сделки
   */
  async createDeal(params: CreateDealParams): Promise<AmoCRMDeal> {
    const { name, price, contactId, customFields } = params

    // В DEMO режиме возвращаем фейковую сделку
    if (this.config.mode === 'demo') {
      const fakeId = Math.floor(Math.random() * 1000000)
      const statusId = parseInt(process.env.AMOCRM_STATUS_BOOKED || '142') || 142
      
      // Импортируем логгер
      const { amocrmLogger } = await import('./amocrm-logger')
      amocrmLogger.log('deal_created', {
        dealId: fakeId,
        name,
        price,
        contactId,
        statusId,
        customFields,
        mode: 'demo',
      })

      return {
        id: fakeId,
        name,
        status_id: statusId,
      }
    }

    // Production режим
    try {
      const pipelineId = parseInt(process.env.AMOCRM_PIPELINE_ID || '0')
      const statusId = parseInt(process.env.AMOCRM_STATUS_BOOKED || '0')

      const dealData = [
        {
          name,
          price,
          pipeline_id: pipelineId,
          status_id: statusId,
          _embedded: {
            contacts: [{ id: contactId }],
          },
          custom_fields_values: this.buildCustomFields(customFields),
        },
      ]

      const response = await this.makeRequest(`${this.baseUrl}/leads`, 'POST', dealData)

      const dealId = response._embedded.leads[0].id
      console.log('AmoCRM: сделка создана', dealId)

      return {
        id: dealId,
        name,
        status_id: statusId,
      }
    } catch (error) {
      console.error('AmoCRM: ошибка при создании сделки', error)
      throw new Error('Ошибка при создании сделки в AmoCRM')
    }
  }

  /**
   * Обновление статуса сделки
   */
  async updateDealStatus(dealId: number, statusId?: number): Promise<void> {
    // В DEMO режиме просто логируем
    if (this.config.mode === 'demo') {
      const newStatusId = statusId || parseInt(process.env.AMOCRM_STATUS_PAID || '143')
      
      // Импортируем логгер
      const { amocrmLogger } = await import('./amocrm-logger')
      amocrmLogger.log('status_changed', {
        dealId,
        oldStatusId: parseInt(process.env.AMOCRM_STATUS_BOOKED || '142'),
        newStatusId,
        statusName: 'Оплачено',
        mode: 'demo',
      })
      return
    }

    // Production режим
    try {
      const newStatusId = statusId || parseInt(process.env.AMOCRM_STATUS_PAID || '0')

      const updateData = {
        status_id: newStatusId,
      }

      await this.makeRequest(`${this.baseUrl}/leads/${dealId}`, 'PATCH', updateData)

      console.log('AmoCRM: статус сделки обновлен', dealId, newStatusId)
    } catch (error) {
      console.error('AmoCRM: ошибка при обновлении статуса', error)
      throw new Error('Ошибка при обновлении статуса в AmoCRM')
    }
  }

  /**
   * Формирование кастомных полей
   */
  private buildCustomFields(fields: CreateDealParams['customFields']) {
    const customFields = []

    // Взрослые билеты
    const adultTicketsFieldId = process.env.AMOCRM_FIELD_ADULT_TICKETS
    if (adultTicketsFieldId) {
      customFields.push({
        field_id: parseInt(adultTicketsFieldId),
        values: [{ value: fields.adultTickets }],
      })
    }

    // Детские билеты
    const childTicketsFieldId = process.env.AMOCRM_FIELD_CHILD_TICKETS
    if (childTicketsFieldId) {
      customFields.push({
        field_id: parseInt(childTicketsFieldId),
        values: [{ value: fields.childTickets }],
      })
    }

    // Детские бесплатные билеты
    const infantTicketsFieldId = process.env.AMOCRM_FIELD_INFANT_TICKETS
    if (infantTicketsFieldId) {
      customFields.push({
        field_id: parseInt(infantTicketsFieldId),
        values: [{ value: fields.infantTickets }],
      })
    }

    // Дата экскурсии
    const excursionDateFieldId = process.env.AMOCRM_FIELD_EXCURSION_DATE
    if (excursionDateFieldId) {
      const timestamp = Math.floor(new Date(fields.excursionDate).getTime() / 1000)
      customFields.push({
        field_id: parseInt(excursionDateFieldId),
        values: [{ value: timestamp }],
      })
    }

    // Ссылка на оплату
    const paymentLinkFieldId = process.env.AMOCRM_FIELD_PAYMENT_LINK
    if (paymentLinkFieldId) {
      customFields.push({
        field_id: parseInt(paymentLinkFieldId),
        values: [{ value: fields.paymentLink }],
      })
    }

    return customFields
  }

  /**
   * Выполнение запроса к API AmoCRM
   */
  private async makeRequest(url: string, method: string, data?: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.accessToken}`,
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AmoCRM API error:', response.status, errorText)
      throw new Error(`AmoCRM API error: ${response.status}`)
    }

    return await response.json()
  }
}

// Экспортируем singleton
export const amocrm = new AmoCRMClient()

// Типы для использования
export type { CreateContactParams, CreateDealParams, AmoCRMContact, AmoCRMDeal }
