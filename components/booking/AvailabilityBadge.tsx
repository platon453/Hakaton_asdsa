'use client'

import { Badge } from '@/components/ui/badge'

interface AvailabilityBadgeProps {
  available: number
  total: number
}

export function AvailabilityBadge({ available, total }: AvailabilityBadgeProps) {
  const percentage = (available / total) * 100

  // Определяем цвет и текст в зависимости от процента доступности
  let bgColor = 'bg-green-500/20'
  let textColor = 'text-green-400'
  let text = 'Много мест'

  if (percentage === 0) {
    bgColor = 'bg-red-500/20'
    textColor = 'text-red-400'
    text = 'Нет мест'
  } else if (percentage < 20) {
    bgColor = 'bg-red-500/20'
    textColor = 'text-red-400'
    text = 'Осталось мало'
  } else if (percentage < 50) {
    bgColor = 'bg-yellow-500/20'
    textColor = 'text-yellow-400'
    text = 'Места заканчиваются'
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-semibold`}>
        {text}
      </span>
      <span className="text-sm text-white/60">
        Свободно {available} из {total}
      </span>
    </div>
  )
}
