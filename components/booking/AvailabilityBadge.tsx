'use client'

import { Badge } from '@/components/ui/badge'

interface AvailabilityBadgeProps {
  available: number
  total: number
}

export function AvailabilityBadge({ available, total }: AvailabilityBadgeProps) {
  const percentage = (available / total) * 100

  // Определяем цвет и вариант в зависимости от процента доступности
  let variant: 'success' | 'warning' | 'danger' = 'success'
  let text = 'Много мест'

  if (percentage === 0) {
    variant = 'danger'
    text = 'Нет мест'
  } else if (percentage < 20) {
    variant = 'danger'
    text = 'Осталось мало'
  } else if (percentage < 50) {
    variant = 'warning'
    text = 'Места заканчиваются'
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant}>{text}</Badge>
      <span className="text-sm text-muted-foreground">
        Свободно {available} из {total}
      </span>
    </div>
  )
}
