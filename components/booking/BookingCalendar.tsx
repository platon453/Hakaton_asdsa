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
        
        console.log('Loading slots for date:', dateStr) // Debug
        
        const allSlots = await fetchSlots(dateStr, dateStr)

        console.log('Received slots:', allSlots.length) // Debug

        setSlots(allSlots)
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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Календарь</h2>
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Правая колонка - список слотов */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">
          {formatDate(selectedDate)}
        </h2>

        {error ? (
          <div className="glass border-red-500/20 rounded-2xl p-6 text-red-300">
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
