'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface TicketSelectorProps {
  label: string
  price: number
  count: number
  onChange: (count: number) => void
  max?: number
}

export function TicketSelector({
  label,
  price,
  count,
  onChange,
  max = 10,
}: TicketSelectorProps) {
  const increment = () => {
    if (count < max) {
      onChange(count + 1)
    }
  }

  const decrement = () => {
    if (count > 0) {
      onChange(count - 1)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">
          {price === 0 ? 'Бесплатно' : formatPrice(price)}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={count === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold w-8 text-center">{count}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={count >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
