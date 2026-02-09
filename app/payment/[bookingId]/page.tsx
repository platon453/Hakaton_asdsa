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
    // TODO: На следующем этапе будет редирект на PayKeeper
    // Пока что симулируем успешную оплату
    alert('На следующем этапе здесь будет редирект на PayKeeper для оплаты!')
    
    // Временно редиректим на страницу благодарности
    setTimeout(() => {
      router.push(`/thank-you?bookingId=${params.bookingId}`)
    }, 1000)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg text-muted-foreground">Загрузка...</p>
        </div>
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-lg text-red-600">Бронирование не найдено</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Оплата бронирования</h1>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Бронирование создано</CardTitle>
                <Badge variant="warning">
                  <Clock className="h-3 w-3 mr-1" />
                  Ожидает оплаты
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Бронирование успешно создано!
                    </h3>
                    <p className="text-sm text-green-700">
                      Номер бронирования: <strong>{booking.id.slice(0, 8).toUpperCase()}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Детали бронирования:</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата:</span>
                    <span className="font-medium">{new Date(booking.slot.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Время:</span>
                    <span className="font-medium">{booking.slot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Билетов:</span>
                    <span className="font-medium">
                      {booking.adultTickets + booking.childTickets + booking.infantTickets}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Контактная информация:</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div><strong>Имя:</strong> {booking.user.name}</div>
                  <div><strong>Телефон:</strong> {booking.user.phone}</div>
                  <div><strong>Email:</strong> {booking.user.email}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Сумма к оплате:</span>
                  <span className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0,
                    }).format(booking.totalAmount)}
                  </span>
                </div>

                <Button onClick={handlePayment} className="w-full" size="lg">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Перейти к оплате
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  После оплаты подтверждение будет отправлено на {booking.user.email}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">ℹ️ Информация:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Бронирование действительно 30 минут</li>
              <li>После оплаты вы получите подтверждение на email</li>
              <li>Можно оплатить картой или через СБП</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
