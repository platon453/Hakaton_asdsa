import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  errorResponse,
  successResponse,
  calculateBookingTotal,
  calculateTotalTickets,
  checkSlotAvailability,
  type BookingInput,
} from '@/lib/api-utils'

// POST /api/bookings - создать бронирование
export async function POST(request: NextRequest) {
  try {
    const body: BookingInput = await request.json()

    // Валидация входных данных
    if (!body.slotId || !body.user || !body.tickets) {
      return errorResponse('Не все обязательные поля заполнены')
    }

    if (!body.user.name || !body.user.phone || !body.user.email) {
      return errorResponse('Заполните все контактные данные')
    }

    if (!body.agreements?.offer || !body.agreements?.personalData) {
      return errorResponse('Необходимо согласие с условиями')
    }

    const totalTickets = calculateTotalTickets(body.tickets)
    if (totalTickets === 0) {
      return errorResponse('Выберите хотя бы один билет')
    }

    if (totalTickets > 10) {
      return errorResponse('Максимум 10 билетов за одно бронирование')
    }

    // Проверяем доступность слота
    const availability = await checkSlotAvailability(body.slotId, totalTickets)
    if (!availability.available) {
      return errorResponse(availability.error || 'Слот недоступен')
    }

    const slot = availability.slot!

    // Рассчитываем стоимость
    const totalAmount = calculateBookingTotal(slot.tariff, body.tickets)

    // Используем транзакцию для создания бронирования
    const result = await prisma.$transaction(async (tx) => {
      // 1. Создаем или находим пользователя
      const user = await tx.user.upsert({
        where: { email: body.user.email },
        update: {
          name: body.user.name,
          phone: body.user.phone,
        },
        create: {
          name: body.user.name,
          phone: body.user.phone,
          email: body.user.email,
        },
      })

      // 2. Создаем бронирование
      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          slotId: body.slotId,
          adultTickets: body.tickets.adult,
          childTickets: body.tickets.child,
          infantTickets: body.tickets.infant,
          totalAmount: totalAmount,
          status: 'PENDING',
        },
        include: {
          user: true,
          slot: {
            include: {
              tariff: true,
            },
          },
        },
      })

      // 3. Обновляем доступность слота
      await tx.slot.update({
        where: { id: body.slotId },
        data: {
          availableCapacity: {
            decrement: totalTickets,
          },
        },
      })

      // 4. Проверяем, не заполнился ли слот полностью
      const updatedSlot = await tx.slot.findUnique({
        where: { id: body.slotId },
      })

      if (updatedSlot && updatedSlot.availableCapacity <= 0) {
        await tx.slot.update({
          where: { id: body.slotId },
          data: { status: 'FULL' },
        })
      }

      return booking
    })

    // Генерируем ссылку на оплату через PayKeeper
    const { paykeeper } = await import('@/lib/paykeeper')
    
    const paymentResponse = await paykeeper.createPayment({
      orderId: result.id,
      amount: Number(result.totalAmount),
      clientEmail: result.user.email,
      clientPhone: result.user.phone,
      clientName: result.user.name,
    })

    // Обновляем бронирование со ссылкой на оплату
    await prisma.booking.update({
      where: { id: result.id },
      data: { 
        paymentLink: paymentResponse.url,
        paymentId: paymentResponse.invoiceId,
      },
    })

    // TODO: На следующих этапах здесь будет:
    // - Создание контакта и сделки в AmoCRM
    // - Отправка email уведомления

    // Получаем обновленное бронирование с ссылкой на оплату
    const updatedBooking = await prisma.booking.findUnique({
      where: { id: result.id },
      include: {
        user: true,
        slot: {
          include: {
            tariff: true,
          },
        },
      },
    })

    // Форматируем ответ
    const response = {
      booking: {
        id: updatedBooking!.id,
        status: updatedBooking!.status,
        totalAmount: Number(updatedBooking!.totalAmount),
        adultTickets: updatedBooking!.adultTickets,
        childTickets: updatedBooking!.childTickets,
        infantTickets: updatedBooking!.infantTickets,
        paymentLink: updatedBooking!.paymentLink || '',
        slot: {
          date: updatedBooking!.slot.date.toISOString().split('T')[0],
          time: updatedBooking!.slot.time,
        },
        user: {
          name: updatedBooking!.user.name,
          email: updatedBooking!.user.email,
          phone: updatedBooking!.user.phone,
        },
      },
    }

    return successResponse(response, 201)
  } catch (error) {
    console.error('Error creating booking:', error)
    return errorResponse('Ошибка при создании бронирования', 500)
  }
}

// GET /api/bookings - получить список бронирований (для админки)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: true,
        slot: {
          include: {
            tariff: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Ограничение на количество результатов
    })

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      totalAmount: Number(booking.totalAmount),
      adultTickets: booking.adultTickets,
      childTickets: booking.childTickets,
      infantTickets: booking.infantTickets,
      createdAt: booking.createdAt.toISOString(),
      paidAt: booking.paidAt?.toISOString() || null,
      slot: {
        date: booking.slot.date.toISOString().split('T')[0],
        time: booking.slot.time,
        tariff: booking.slot.tariff.name,
      },
      user: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
    }))

    return successResponse({ bookings: formattedBookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return errorResponse('Ошибка при получении бронирований', 500)
  }
}
