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
    <div className="max-w-2xl mx-auto">
      {/* Информация о слоте */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Выбранный слот</div>
              <div className="font-semibold text-lg">
                {formatDate(new Date(slot.date))} в {slot.time}
              </div>
              <div className="text-sm text-muted-foreground">{slot.tariff.name}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Изменить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Индикатор шагов */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            1
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            2
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        {/* Шаг 1: Выбор билетов */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Шаг 1: Выберите билеты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <p className="text-sm text-red-600">{errors.tickets.adult.message}</p>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Итого:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(totalAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {totalTickets} {totalTickets === 1 ? 'билет' : 'билета'}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Далее
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Шаг 2: Контактные данные */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Шаг 2: Контактные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Иван Иванов"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+79001234567"
                  className="mt-1"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="ivan@example.com"
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="pt-4 border-t flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Назад
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="flex-1"
                >
                  Далее
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Шаг 3: Подтверждение */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Шаг 3: Подтверждение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Сводка заказа */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold">Детали бронирования:</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата:</span>
                    <span className="font-medium">{formatDate(new Date(slot.date))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Время:</span>
                    <span className="font-medium">{slot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Тариф:</span>
                    <span className="font-medium">{slot.tariff.name}</span>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2 text-sm">
                  {tickets.adult > 0 && (
                    <div className="flex justify-between">
                      <span>Взрослых билетов: {tickets.adult}</span>
                      <span>{formatPrice(tickets.adult * slot.tariff.adultPrice)}</span>
                    </div>
                  )}
                  {tickets.child > 0 && (
                    <div className="flex justify-between">
                      <span>Детских билетов: {tickets.child}</span>
                      <span>{formatPrice(tickets.child * slot.tariff.childPrice)}</span>
                    </div>
                  )}
                  {tickets.infant > 0 && (
                    <div className="flex justify-between">
                      <span>Детских (до 3 лет): {tickets.infant}</span>
                      <span>Бесплатно</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-semibold text-lg">Итого к оплате:</span>
                  <span className="font-bold text-2xl text-primary">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Контактная информация */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <h4 className="font-semibold mb-3">Контактная информация:</h4>
                <div><strong>Имя:</strong> {name}</div>
                <div><strong>Телефон:</strong> {phone}</div>
                <div><strong>Email:</strong> {email}</div>
              </div>

              {/* Согласия */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="offer"
                    checked={offerAccepted}
                    onCheckedChange={(checked) => setOfferAccepted(checked === true)}
                  />
                  <label htmlFor="offer" className="text-sm leading-none cursor-pointer">
                    Ознакомлен с{' '}
                    <a href="#" className="text-primary underline">
                      договором оферты
                    </a>{' '}
                    *
                  </label>
                </div>
                {!offerAccepted && step === 3 && (
                  <p className="text-sm text-red-600">Необходимо согласие с договором оферты</p>
                )}

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="personalData"
                    checked={personalDataAccepted}
                    onCheckedChange={(checked) => setPersonalDataAccepted(checked === true)}
                  />
                  <label htmlFor="personalData" className="text-sm leading-none cursor-pointer">
                    Даю согласие на обработку персональных данных в соответствии с{' '}
                    <a href="#" className="text-primary underline">
                      политикой конфиденциальности
                    </a>{' '}
                    *
                  </label>
                </div>
                {!personalDataAccepted && step === 3 && (
                  <p className="text-sm text-red-600">
                    Необходимо согласие на обработку персональных данных
                  </p>
                )}
              </div>

              {/* Кнопки */}
              <div className="pt-4 border-t flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Назад
                </Button>
                <Button
                  type="submit"
                  disabled={!offerAccepted || !personalDataAccepted}
                  className="flex-1"
                >
                  Забронировать и оплатить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
