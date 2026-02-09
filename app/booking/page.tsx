'use client'

import { useState } from 'react'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import type { Slot } from '@/lib/api-client'

export default function BookingPage() {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
    console.log('Selected slot:', slot)
    // TODO: На следующем этапе будет редирект на форму бронирования
    alert(`Выбран слот: ${slot.date} в ${slot.time}\nНа следующем этапе здесь откроется форма бронирования!`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Бронирование экскурсии 🦙
          </h1>
          <p className="text-lg text-gray-600">
            Выберите удобную дату и время для посещения нашей фермы
          </p>
        </div>

        {/* Календарь и слоты */}
        <BookingCalendar onSlotSelect={handleSlotSelect} />

        {/* Информация */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Полезная информация</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Длительность экскурсии: ~1.5 часа</li>
            <li>• Можно покормить и погладить альпак</li>
            <li>• Фотосессия включена в стоимость</li>
            <li>• Дети до 3 лет проходят бесплатно</li>
            <li>• При бронировании более 5 мест действует скидка</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
