'use client'

import { useState, useEffect } from 'react'
import { DateSelector } from './DateSelector'
import { SlotList } from './SlotList'
import { fetchSlots, type Slot } from '@/lib/api-client'
import { formatDate } from '@/lib/utils'

interface BookingCalendarProps {
  onSlotSelect: (slot: Slot) => void
}

export function BookingCalendar({ onSlotSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем слоты при изменении даты
  useEffect(() => {
    const loadSlots = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Получаем слоты только для выбранной даты
        const dateStr = selectedDate.toISOString().split('T')[0]
        const allSlots = await fetchSlots(dateStr, dateStr)

        // Фильтруем слоты по выбранной дате
        const filteredSlots = allSlots.filter((slot) => {
          return slot.date === dateStr
        })

        setSlots(filteredSlots)
      } catch (err) {
        console.error('Error loading slots:', err)
        setError('Ошибка при загрузке слотов')
      } finally {
        setIsLoading(false)
      }
    }

    loadSlots()
  }, [selectedDate])

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Левая колонка - выбор даты */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Выберите дату</h2>
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Правая колонка - список слотов */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Доступные слоты на {formatDate(selectedDate)}
        </h2>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : (
          <SlotList
            slots={slots}
            onSlotSelect={onSlotSelect}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
