'use client'

import { useRouter } from 'next/navigation'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import type { Slot } from '@/lib/api-client'

export default function BookingPage() {
  const router = useRouter()

  const handleSlotSelect = (slot: Slot) => {
    // Редирект на страницу оформления бронирования
    router.push(`/booking/${slot.id}`)
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <div className="relative">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Заголовок */}
          <div className="text-center mb-16 fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Выберите дату
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Найдите идеальное время для встречи с альпаками
            </p>
          </div>

          {/* Календарь и слоты */}
          <div className="mb-16">
            <BookingCalendar onSlotSelect={handleSlotSelect} />
          </div>

          {/* Информация */}
          <div className="glass rounded-3xl p-8 max-w-3xl mx-auto fade-in-delay">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">ℹ️</span>
              Полезная информация
            </h3>
            <ul className="text-white/70 space-y-3 text-base">
              <li className="flex items-start gap-3">
                <span className="text-white/40">•</span>
                <span>Длительность экскурсии: ~1.5 часа</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/40">•</span>
                <span>Можно покормить и погладить альпак</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/40">•</span>
                <span>Фотосессия включена в стоимость</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/40">•</span>
                <span>Дети до 3 лет проходят бесплатно</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
