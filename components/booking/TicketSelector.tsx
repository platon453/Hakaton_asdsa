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
    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
      <div>
        <div className="font-semibold text-white text-base">{label}</div>
        <div className="text-sm text-white/60 mt-1">
          {price === 0 ? 'Бесплатно' : formatPrice(price)}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          disabled={count === 0}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/20"
        >
          <Minus className="h-4 w-4 text-white" />
        </button>
        <span className="text-xl font-bold w-10 text-center text-white">{count}</span>
        <button
          type="button"
          onClick={increment}
          disabled={count >= max}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/20"
        >
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  )
}
