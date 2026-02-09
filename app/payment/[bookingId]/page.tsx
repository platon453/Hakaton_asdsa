'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, CreditCard } from 'lucide-react'

interface Booking {
  id: string
  status: string
  totalAmount: number
  adultTickets: number
  childTickets: number
  infantTickets: number
  paymentLink: string
  slot: {
    date: string
    time: string
  }
  user: {
    name: string
    email: string
    phone: string
  }
}

export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBooking = async () => {
      try {
        // Загружаем информацию о бронировании
        const response = await fetch(`/api/bookings/${params.bookingId}`)
        if (response.ok) {
          const data = await response.json()
          setBooking(data)
        }
      } catch (err) {
        console.error('Error loading booking:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBooking()
  }, [params.bookingId])

  const handlePayment = () => {
    if (booking?.paymentLink) {
      // Редирект на страницу оплаты PayKeeper (в DEMO режиме это наша страница)
      window.location.href = booking.paymentLink
    } else {
      alert('Ошибка: ссылка на оплату не найдена')
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
        <div className="relative text-center py-12 fade-in">
          <div className="text-6xl mb-6">⏳</div>
          <p className="text-2xl text-white/60">Загрузка...</p>
        </div>
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
        <div className="relative text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-2xl text-red-300">Бронирование не найдено</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <div className="relative">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-12 fade-in">
            Оплата бронирования
          </h1>

          <div className="glass rounded-3xl p-8 mb-8 fade-in-delay">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Бронирование создано</h2>
              <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Ожидает оплаты
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-300 mb-2 text-lg">
                      Бронирование успешно создано!
                    </h3>
                    <p className="text-sm text-green-400/80">
                      Номер бронирования: <strong className="text-green-300">{booking.id.slice(0, 8).toUpperCase()}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-white text-lg">Детали бронирования:</h3>
                <div className="bg-white/5 p-6 rounded-2xl space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-white/60">Дата:</span>
                    <span className="font-medium text-white">{new Date(booking.slot.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Время:</span>
                    <span className="font-medium text-white">{booking.slot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Билетов:</span>
                    <span className="font-medium text-white">
                      {booking.adultTickets + booking.childTickets + booking.infantTickets}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-white text-lg">Контактная информация:</h3>
                <div className="bg-white/5 p-6 rounded-2xl space-y-2 text-base">
                  <div className="text-white/90"><strong className="text-white">Имя:</strong> {booking.user.name}</div>
                  <div className="text-white/90"><strong className="text-white">Телефон:</strong> {booking.user.phone}</div>
                  <div className="text-white/90"><strong className="text-white">Email:</strong> {booking.user.email}</div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-semibold text-white">Сумма к оплате:</span>
                  <span className="text-4xl font-bold text-white">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0,
                    }).format(booking.totalAmount)}
                  </span>
                </div>

                <button onClick={handlePayment} className="btn-premium w-full text-lg py-4">
                  <CreditCard className="h-5 w-5 mr-2 inline" />
                  Перейти к оплате
                </button>

                <p className="text-sm text-white/50 text-center mt-4">
                  После оплаты подтверждение будет отправлено на {booking.user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 text-sm text-white/80">
            <p className="font-semibold mb-3 text-white flex items-center gap-2">
              <span className="text-xl">ℹ️</span>
              Информация:
            </p>
            <ul className="space-y-2 ml-7">
              <li>• Бронирование действительно 30 минут</li>
              <li>• После оплаты вы получите подтверждение на email</li>
              <li>• Можно оплатить картой или через СБП</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
