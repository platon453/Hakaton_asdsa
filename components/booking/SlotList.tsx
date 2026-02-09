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
            className="h-64 glass rounded-3xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-16 glass rounded-3xl border border-dashed border-white/20">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-2xl font-bold text-white mb-2">Нет доступных слотов</h3>
        <p className="text-white/60">
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
