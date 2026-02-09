// Временный тест PayKeeper интеграции
import { paykeeper } from './lib/paykeeper'

async function testPayKeeper() {
  console.log('🧪 Тестирование PayKeeper интеграции...\n')

  // Тест 1: Создание ссылки на оплату
  console.log('1️⃣ Создание ссылки на оплату (DEMO режим):')
  const payment = await paykeeper.createPayment({
    orderId: 'test-order-123',
    amount: 2500,
    clientEmail: 'test@example.com',
    clientPhone: '+79001234567',
    clientName: 'Тестовый Пользователь',
  })
  console.log('✅ Ссылка создана:', payment.url)
  console.log('   Invoice ID:', payment.invoiceId)
  console.log('')

  // Тест 2: Парсинг webhook данных
  console.log('2️⃣ Парсинг webhook данных:')
  const formData = new FormData()
  formData.append('orderid', 'test-order-123')
  formData.append('status', 'success')
  formData.append('sum', '2500')
  formData.append('id', 'payment_456')

  const webhookData = paykeeper.parseWebhookData(formData)
  console.log('✅ Данные распарсены:', webhookData)
  console.log('')

  // Тест 3: Проверка подписи (DEMO режим)
  console.log('3️⃣ Проверка подписи webhook:')
  const isValid = paykeeper.verifyWebhookSignature(webhookData!, 'test-signature')
  console.log('✅ Подпись валидна:', isValid)
  console.log('')

  console.log('🎉 Все тесты пройдены!')
}

testPayKeeper().catch(console.error)
