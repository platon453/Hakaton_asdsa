'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AvailabilityBadge } from './AvailabilityBadge'
import { formatPrice } from '@/lib/utils'
import type { Slot } from '@/lib/api-client'

interface SlotCardProps {
  slot: Slot
  onSelect: (slot: Slot) => void
}

export function SlotCard({ slot, onSelect }: SlotCardProps) {
  const isAvailable = slot.availableCapacity > 0 && slot.status === 'ACTIVE'

  return (
    <div className={`glass rounded-3xl p-6 hover-lift ${!isAvailable ? 'opacity-40' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-3xl font-bold text-white">{slot.time}</div>
          <div className="text-sm text-white/40 mt-1">{slot.tariff.name}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/40">От</div>
          <div className="text-2xl font-bold text-white">{formatPrice(slot.tariff.adultPrice)}</div>
        </div>
      </div>

      <div className="mb-6">
        <AvailabilityBadge
          available={slot.availableCapacity}
          total={slot.totalCapacity}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-white/40 mb-1">Взрослый</div>
          <div className="text-sm font-semibold text-white">{formatPrice(slot.tariff.adultPrice)}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-white/40 mb-1">Детский</div>
          <div className="text-sm font-semibold text-white">{formatPrice(slot.tariff.childPrice)}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-white/40 mb-1">До 3 лет</div>
          <div className="text-sm font-semibold text-white">Бесплатно</div>
        </div>
      </div>

      <button
        onClick={() => onSelect(slot)}
        disabled={!isAvailable}
        className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
          isAvailable 
            ? 'bg-white text-black hover:bg-white/90 hover:-translate-y-0.5' 
            : 'bg-white/10 text-white/40 cursor-not-allowed'
        }`}
      >
        {isAvailable ? 'Забронировать' : 'Нет мест'}
      </button>
    </div>
  )
}
