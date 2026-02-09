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
    <main className="min-h-screen bg-[#050505]">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <div className="relative">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="glass rounded-3xl p-12 fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                <Check className="h-10 w-10 text-green-400" />
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Спасибо за бронирование! 🎉
              </h1>
              
              <p className="text-2xl text-white/70 mb-10">
                Ваше бронирование успешно оплачено
              </p>

              {bookingId && (
                <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/10">
                  <p className="text-sm text-white/60 mb-2">
                    Номер бронирования:
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {bookingId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              )}

              <div className="glass-strong rounded-2xl p-8 text-left mb-8">
                <h3 className="font-semibold text-white mb-4 text-xl flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  Письмо отправлено на вашу почту
                </h3>
                <p className="text-base text-white/70 mb-4">
                  В письме вы найдете:
                </p>
                <ul className="text-base text-white/80 space-y-2 ml-1">
                  <li>• Подтверждение бронирования с деталями</li>
                  <li>• Чек оплаты</li>
                  <li>• Памятку для посетителей</li>
                  <li>• Схему проезда до фермы</li>
                </ul>
              </div>

              <div className="glass-strong rounded-2xl p-8 text-left mb-10">
                <h3 className="font-semibold text-white mb-4 text-xl flex items-center gap-3">
                  <span className="text-2xl">🦙</span>
                  Полезная информация
                </h3>
                <ul className="text-base text-white/80 space-y-3 ml-1">
                  <li>• Приезжайте за 10-15 минут до начала экскурсии</li>
                  <li>• Возьмите с собой воду и удобную обувь</li>
                  <li>• Можно взять угощение для альпак (морковь, яблоки)</li>
                  <li>• Адрес: Московская область, деревня Лучки</li>
                  <li>• Телефон: +7 (900) 123-45-67</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="flex-1">
                  <button className="btn-secondary w-full">
                    На главную
                  </button>
                </Link>
                <Link href="/booking" className="flex-1">
                  <button className="btn-premium w-full">
                    Забронировать еще
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
        <div className="relative text-center py-12 fade-in">
          <div className="text-6xl mb-6">⏳</div>
          <p className="text-2xl text-white/60">Загрузка...</p>
        </div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
