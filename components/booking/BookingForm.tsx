'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema, type BookingFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketSelector } from './TicketSelector'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import type { Slot } from '@/lib/api-client'
import { ArrowLeft } from 'lucide-react'

interface BookingFormProps {
  slot: Slot
  onBack: () => void
  onSubmit: (data: BookingFormData) => void
}

export function BookingForm({ slot, onBack, onSubmit }: BookingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '+7',
      email: '',
      tickets: {
        adult: 0,
        child: 0,
        infant: 0,
      },
    },
  })

  const tickets = watch('tickets')
  const name = watch('name')
  const phone = watch('phone')
  const email = watch('email')
  
  const [offerAccepted, setOfferAccepted] = useState(false)
  const [personalDataAccepted, setPersonalDataAccepted] = useState(false)

  // Расчет общей суммы
  const totalAmount =
    tickets.adult * slot.tariff.adultPrice +
    tickets.child * slot.tariff.childPrice +
    tickets.infant * slot.tariff.infantPrice

  const totalTickets = tickets.adult + tickets.child + tickets.infant

  const canProceedToStep2 = totalTickets > 0 && totalTickets <= 10
  const canProceedToStep3 =
    canProceedToStep2 && name && phone.length === 12 && email && !errors.name && !errors.phone && !errors.email

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Валидируем согласия вручную
    if (!offerAccepted || !personalDataAccepted) {
      return
    }
    
    // Собираем данные формы
    const formData: BookingFormData = {
      name,
      phone,
      email,
      tickets,
      agreements: {
        offer: true,
        personalData: true,
      },
    }
    
    onSubmit(formData)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Информация о слоте */}
      <div className="glass rounded-3xl p-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/40 mb-1">Выбранный слот</div>
            <div className="font-bold text-2xl text-white mb-1">
              {formatDate(new Date(slot.date))} в {slot.time}
            </div>
            <div className="text-sm text-white/60">{slot.tariff.name}</div>
          </div>
          <button onClick={onBack} className="btn-secondary text-sm">
            <ArrowLeft className="h-4 w-4 mr-2 inline" />
            Изменить
          </button>
        </div>
      </div>

      {/* Индикатор шагов */}
      <div className="flex items-center justify-center mb-12 fade-in-delay">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all ${
              step >= 1 ? 'bg-white text-black scale-110' : 'bg-white/10 text-white/40'
            }`}
          >
            1
          </div>
          <div className={`w-16 h-1 rounded-full transition-all ${step >= 2 ? 'bg-white' : 'bg-white/10'}`} />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all ${
              step >= 2 ? 'bg-white text-black scale-110' : 'bg-white/10 text-white/40'
            }`}
          >
            2
          </div>
          <div className={`w-16 h-1 rounded-full transition-all ${step >= 3 ? 'bg-white' : 'bg-white/10'}`} />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all ${
              step >= 3 ? 'bg-white text-black scale-110' : 'bg-white/10 text-white/40'
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        {/* Шаг 1: Выбор билетов */}
        {step === 1 && (
          <div className="glass rounded-3xl p-8 fade-in-delay">
            <h2 className="text-3xl font-bold text-white mb-8">Шаг 1: Выберите билеты</h2>
            
            <div className="space-y-4">
              <TicketSelector
                label="Взрослый билет"
                price={slot.tariff.adultPrice}
                count={tickets.adult}
                onChange={(count) => setValue('tickets.adult', count)}
              />

              <TicketSelector
                label="Детский билет (3-12 лет)"
                price={slot.tariff.childPrice}
                count={tickets.child}
                onChange={(count) => setValue('tickets.child', count)}
              />

              <TicketSelector
                label="Детский билет (до 3 лет)"
                price={slot.tariff.infantPrice}
                count={tickets.infant}
                onChange={(count) => setValue('tickets.infant', count)}
              />

              {errors.tickets?.adult && (
                <p className="text-sm text-red-300">{errors.tickets.adult.message}</p>
              )}

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold text-white">Итого:</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {formatPrice(totalAmount)}
                    </div>
                    <div className="text-sm text-white/60">
                      {totalTickets} {totalTickets === 1 ? 'билет' : 'билета'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-premium w-full"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Далее
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2: Контактные данные */}
        {step === 2 && (
          <div className="glass rounded-3xl p-8 fade-in-delay">
            <h2 className="text-3xl font-bold text-white mb-8">Шаг 2: Контактные данные</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white text-base mb-2 block">Имя *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Иван Иванов"
                  className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                {errors.name && (
                  <p className="text-sm text-red-300 mt-2">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-white text-base mb-2 block">Телефон *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+79001234567"
                  className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                {errors.phone && (
                  <p className="text-sm text-red-300 mt-2">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-white text-base mb-2 block">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="ivan@example.com"
                  className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                {errors.email && (
                  <p className="text-sm text-red-300 mt-2">{errors.email.message}</p>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 flex gap-4">
                <button type="button" className="btn-secondary flex-1" onClick={() => setStep(1)}>
                  Назад
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="btn-premium flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Далее
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3: Подтверждение */}
        {step === 3 && (
          <div className="glass rounded-3xl p-8 fade-in-delay">
            <h2 className="text-3xl font-bold text-white mb-8">Шаг 3: Подтверждение</h2>
            
            <div className="space-y-6">
              {/* Сводка заказа */}
              <div className="bg-white/5 p-6 rounded-2xl space-y-4 border border-white/10">
                <h4 className="font-semibold text-white text-lg">Детали бронирования:</h4>
                
                <div className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-white/60">Дата:</span>
                    <span className="font-medium text-white">{formatDate(new Date(slot.date))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Время:</span>
                    <span className="font-medium text-white">{slot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Тариф:</span>
                    <span className="font-medium text-white">{slot.tariff.name}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3 text-base">
                  {tickets.adult > 0 && (
                    <div className="flex justify-between text-white/90">
                      <span>Взрослых билетов: {tickets.adult}</span>
                      <span className="font-medium text-white">{formatPrice(tickets.adult * slot.tariff.adultPrice)}</span>
                    </div>
                  )}
                  {tickets.child > 0 && (
                    <div className="flex justify-between text-white/90">
                      <span>Детских билетов: {tickets.child}</span>
                      <span className="font-medium text-white">{formatPrice(tickets.child * slot.tariff.childPrice)}</span>
                    </div>
                  )}
                  {tickets.infant > 0 && (
                    <div className="flex justify-between text-white/90">
                      <span>Детских (до 3 лет): {tickets.infant}</span>
                      <span className="font-medium text-white">Бесплатно</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="font-semibold text-xl text-white">Итого к оплате:</span>
                  <span className="font-bold text-3xl text-white">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Контактная информация */}
              <div className="bg-white/5 p-6 rounded-2xl space-y-3 text-base border border-white/10">
                <h4 className="font-semibold mb-3 text-white text-lg">Контактная информация:</h4>
                <div className="text-white/90"><strong className="text-white">Имя:</strong> {name}</div>
                <div className="text-white/90"><strong className="text-white">Телефон:</strong> {phone}</div>
                <div className="text-white/90"><strong className="text-white">Email:</strong> {email}</div>
              </div>

              {/* Согласия */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="offer"
                    checked={offerAccepted}
                    onCheckedChange={(checked) => setOfferAccepted(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="offer" className="text-base leading-relaxed cursor-pointer text-white/90">
                    Ознакомлен с{' '}
                    <a href="#" className="text-white underline hover:text-white/80">
                      договором оферты
                    </a>{' '}
                    *
                  </label>
                </div>
                {!offerAccepted && step === 3 && (
                  <p className="text-sm text-red-300 ml-8">Необходимо согласие с договором оферты</p>
                )}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="personalData"
                    checked={personalDataAccepted}
                    onCheckedChange={(checked) => setPersonalDataAccepted(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="personalData" className="text-base leading-relaxed cursor-pointer text-white/90">
                    Даю согласие на обработку персональных данных в соответствии с{' '}
                    <a href="#" className="text-white underline hover:text-white/80">
                      политикой конфиденциальности
                    </a>{' '}
                    *
                  </label>
                </div>
                {!personalDataAccepted && step === 3 && (
                  <p className="text-sm text-red-300 ml-8">
                    Необходимо согласие на обработку персональных данных
                  </p>
                )}
              </div>

              {/* Кнопки */}
              <div className="pt-6 border-t border-white/10 flex gap-4">
                <button type="button" className="btn-secondary flex-1" onClick={() => setStep(2)}>
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={!offerAccepted || !personalDataAccepted}
                  className="btn-premium flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Забронировать и оплатить
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
