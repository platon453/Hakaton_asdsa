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
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center py-12 fade-in">
          <div className="text-6xl mb-6">⏳</div>
          <p className="text-2xl text-white/60">Загрузка...</p>
        </div>
      </main>
    )
  }

  if (error || !slot) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center py-16 glass rounded-3xl border border-red-500/20">
            <div className="text-6xl mb-6">❌</div>
            <h3 className="text-3xl font-bold mb-4 text-white">Ошибка</h3>
            <p className="text-xl text-red-300 mb-8">{error || 'Слот не найден'}</p>
            <button
              onClick={() => router.push('/booking')}
              className="btn-secondary"
            >
              Вернуться к выбору слотов
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <div className="relative">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-12 fade-in">
            Оформление
          </h1>
          
          {isSubmitting ? (
            <div className="text-center py-20 fade-in">
              <div className="text-6xl mb-6">⏳</div>
              <p className="text-2xl text-white/60">Создаем бронирование...</p>
            </div>
          ) : (
            <BookingForm
              slot={slot}
              onBack={() => router.push('/booking')}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </main>
  )
}
