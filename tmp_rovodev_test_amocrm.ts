// Временный тест AmoCRM интеграции
import { amocrm } from './lib/amocrm'

async function testAmoCRM() {
  console.log('🧪 Тестирование AmoCRM интеграции...\n')

  // Проверка конфигурации
  console.log('1️⃣ Проверка конфигурации:')
  console.log('✅ AmoCRM настроен:', amocrm.isConfigured())
  console.log('   Режим:', process.env.AMOCRM_MODE || 'demo')
  console.log('')

  // Тест 1: Создание контакта
  console.log('2️⃣ Создание контакта:')
  const contact = await amocrm.createOrUpdateContact({
    name: 'Иван Тестовый',
    phone: '+79001234567',
    email: 'ivan.test@example.com',
  })
  console.log('✅ Контакт создан:', contact)
  console.log('')

  // Тест 2: Создание сделки
  console.log('3️⃣ Создание сделки:')
  const deal = await amocrm.createDeal({
    name: 'Тестовое бронирование #12345',
    price: 3800,
    contactId: contact.id,
    customFields: {
      adultTickets: 2,
      childTickets: 1,
      infantTickets: 0,
      excursionDate: '2024-02-15 14:00',
      paymentLink: 'http://localhost:3000/demo-payment?test=1',
    },
  })
  console.log('✅ Сделка создана:', deal)
  console.log('')

  // Тест 3: Обновление статуса сделки
  console.log('4️⃣ Обновление статуса сделки:')
  await amocrm.updateDealStatus(deal.id)
  console.log('✅ Статус обновлен на "Оплачено"')
  console.log('')

  console.log('🎉 Все тесты AmoCRM пройдены!')
}

testAmoCRM().catch(console.error)
