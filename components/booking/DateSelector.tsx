'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Получаем массив дат на текущий месяц
  const getDatesInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const dates: Date[] = []

    // Добавляем даты начиная с сегодня
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      if (d >= today) {
        dates.push(new Date(d))
      }
    }

    return dates
  }

  const dates = getDatesInMonth(currentMonth)

  const nextMonth = () => {
    const next = new Date(currentMonth)
    next.setMonth(next.getMonth() + 1)
    setCurrentMonth(next)
  }

  const prevMonth = () => {
    const prev = new Date(currentMonth)
    prev.setMonth(prev.getMonth() - 1)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (prev >= today || prev.getMonth() === today.getMonth()) {
      setCurrentMonth(prev)
    }
  }

  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const formatWeekday = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
    }).format(date)
  }

  const formatDay = (date: Date) => {
    return date.getDate()
  }

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="glass rounded-3xl p-6">
      {/* Заголовок с навигацией */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={currentMonth.getMonth() === today.getMonth()}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <h3 className="text-lg font-bold text-white capitalize">
          {formatMonthYear(currentMonth)}
        </h3>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Сетка дат */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, index) => (
          <button
            key={index}
            onClick={() => onDateChange(date)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-2xl transition-all
              ${
                isSelected(date)
                  ? 'bg-white text-black font-bold scale-105'
                  : 'hover:bg-white/10 text-white'
              }
            `}
          >
            <span className={`text-xs mb-1 ${isSelected(date) ? 'text-black/60' : 'text-white/40'}`}>
              {formatWeekday(date)}
            </span>
            <span className="text-lg font-semibold">{formatDay(date)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
