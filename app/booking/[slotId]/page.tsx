'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingForm } from '@/components/booking/BookingForm'
import { fetchSlot, createBooking, type Slot } from '@/lib/api-client'
import type { BookingFormData } from '@/lib/validations'

export default function BookingFormPage({ params }: { params: { slotId: string } }) {
  const router = useRouter()
  const [slot, setSlot] = useState<Slot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadSlot = async () => {
      try {
        const data = await fetchSlot(params.slotId)
        setSlot(data)
      } catch (err) {
        console.error('Error loading slot:', err)
        setError('Ошибка при загрузке слота')
      } finally {
        setIsLoading(false)
      }
    }

    loadSlot()
  }, [params.slotId])

  const handleSubmit = async (data: BookingFormData) => {
    if (!slot) return

    setIsSubmitting(true)

    try {
      const result = await createBooking({
        slotId: slot.id,
        user: {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
        tickets: data.tickets,
        agreements: data.agreements,
      })

      // Перенаправляем на страницу оплаты
      router.push(`/payment/${result.booking.id}`)
    } catch (err: any) {
      console.error('Error creating booking:', err)
      alert(`Ошибка при создании бронирования: ${err.message}`)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg text-muted-foreground">Загрузка...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !slot) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold mb-2 text-red-900">Ошибка</h3>
            <p className="text-red-700">{error || 'Слот не найден'}</p>
            <button
              onClick={() => router.push('/booking')}
              className="mt-4 text-primary underline"
            >
              Вернуться к выбору слотов
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Оформление бронирования</h1>
        
        {isSubmitting ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg text-muted-foreground">Создаем бронирование...</p>
          </div>
        ) : (
          <BookingForm
            slot={slot}
            onBack={() => router.push('/booking')}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  )
}
