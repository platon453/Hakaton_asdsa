'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold mb-4">Спасибо за бронирование! 🎉</h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Ваше бронирование успешно оплачено
              </p>

              {bookingId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-muted-foreground mb-1">
                    Номер бронирования:
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {bookingId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">
                  📧 Письмо отправлено на вашу почту
                </h3>
                <p className="text-sm text-blue-800 mb-2">
                  В письме вы найдете:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Подтверждение бронирования с деталями</li>
                  <li>Чек оплаты</li>
                  <li>Памятку для посетителей</li>
                  <li>Схему проезда до фермы</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left mb-8">
                <h3 className="font-semibold text-green-900 mb-3">
                  🦙 Полезная информация
                </h3>
                <ul className="text-sm text-green-800 space-y-2">
                  <li>• Приезжайте за 10-15 минут до начала экскурсии</li>
                  <li>• Возьмите с собой воду и удобную обувь</li>
                  <li>• Можно взять угощение для альпак (морковь, яблоки)</li>
                  <li>• Адрес: Московская область, деревня Лучки</li>
                  <li>• Телефон: +7 (900) 123-45-67</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    На главную
                  </Button>
                </Link>
                <Link href="/booking" className="flex-1">
                  <Button className="w-full">
                    Забронировать еще
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg text-muted-foreground">Загрузка...</p>
        </div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
