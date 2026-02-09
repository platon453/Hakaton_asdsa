'use client'

import { SlotCard } from './SlotCard'
import type { Slot } from '@/lib/api-client'

interface SlotListProps {
  slots: Slot[]
  onSlotSelect: (slot: Slot) => void
  isLoading?: boolean
}

export function SlotList({ slots, onSlotSelect, isLoading }: SlotListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-40 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-lg font-semibold mb-2">Нет доступных слотов</h3>
        <p className="text-muted-foreground">
          На выбранную дату нет свободных мест. Попробуйте выбрать другой день.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {slots.map((slot) => (
        <SlotCard key={slot.id} slot={slot} onSelect={onSlotSelect} />
      ))}
    </div>
  )
}
