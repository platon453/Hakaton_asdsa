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
    <Card className={`transition-all hover:shadow-md ${!isAvailable ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-primary">{slot.time}</div>
            <div className="text-sm text-muted-foreground mt-1">{slot.tariff.name}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">От</div>
            <div className="text-lg font-semibold">{formatPrice(slot.tariff.adultPrice)}</div>
          </div>
        </div>

        <div className="mb-3">
          <AvailabilityBadge
            available={slot.availableCapacity}
            total={slot.totalCapacity}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-muted-foreground">
          <div>
            <div className="font-medium">Взрослый</div>
            <div>{formatPrice(slot.tariff.adultPrice)}</div>
          </div>
          <div>
            <div className="font-medium">Детский</div>
            <div>{formatPrice(slot.tariff.childPrice)}</div>
          </div>
          <div>
            <div className="font-medium">До 3 лет</div>
            <div>Бесплатно</div>
          </div>
        </div>

        <Button
          onClick={() => onSelect(slot)}
          disabled={!isAvailable}
          className="w-full"
        >
          {isAvailable ? 'Забронировать' : 'Нет мест'}
        </Button>
      </CardContent>
    </Card>
  )
}
