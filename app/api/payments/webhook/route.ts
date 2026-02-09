import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paykeeper } from '@/lib/paykeeper'

// POST /api/payments/webhook - webhook от PayKeeper
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Парсим данные webhook
    const webhookData = paykeeper.parseWebhookData(formData)

    if (!webhookData) {
      console.error('Invalid webhook data')
      return new Response('Invalid data', { status: 400 })
    }

    const { orderId, status, amount, paymentId } = webhookData

    console.log('📥 PayKeeper webhook received:', {
      orderId,
      status,
      amount,
      paymentId,
    })

    // Проверяем подпись (в production)
    const signature = formData.get('signature')?.toString() || ''
    if (!paykeeper.verifyWebhookSignature(webhookData, signature)) {
      console.error('Invalid webhook signature')
      return new Response('Invalid signature', { status: 403 })
    }

    // Обрабатываем успешную оплату
    if (status === 'success' || status === 'paid') {
      // Находим бронирование
      const booking = await prisma.booking.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          slot: {
            include: {
              tariff: true,
            },
          },
        },
      })

      if (!booking) {
        console.error('Booking not found:', orderId)
        return new Response('Booking not found', { status: 404 })
      }

      // Проверяем что бронирование еще не оплачено
      if (booking.status === 'PAID') {
        console.log('Booking already paid:', orderId)
        return new Response('OK', { status: 200 })
      }

      // Обновляем статус бронирования
      await prisma.booking.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paymentId: paymentId,
          paidAt: new Date(),
        },
      })

      console.log('✅ Booking paid successfully:', orderId)

      // Обновляем статус сделки в AmoCRM
      const { amocrm } = await import('@/lib/amocrm')
      
      if (booking.amocrmDealId && amocrm.isConfigured()) {
        try {
          await amocrm.updateDealStatus(booking.amocrmDealId)
          console.log('✅ AmoCRM: статус сделки обновлен на "Оплачено"')
        } catch (error) {
          console.error('❌ AmoCRM update error:', error)
          // Не прерываем процесс, если AmoCRM не работает
        }
      }

      // Отправляем email подтверждение
      const { emailClient } = await import('@/lib/email')
      
      if (emailClient.isConfigured()) {
        try {
          await emailClient.sendBookingConfirmation({
            to: booking.user.email,
            bookingId: booking.id,
            customerName: booking.user.name,
            excursionDate: new Date(booking.slot.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            excursionTime: booking.slot.time,
            adultTickets: booking.adultTickets,
            childTickets: booking.childTickets,
            infantTickets: booking.infantTickets,
            totalAmount: Number(booking.totalAmount),
            tariffName: booking.slot.tariff.name,
          })
          console.log('✅ Email: подтверждение отправлено на', booking.user.email)
        } catch (error) {
          console.error('❌ Email error:', error)
          // Не прерываем процесс, если email не отправился
        }
      }

      return new Response('OK', { status: 200 })
    }

    // Обрабатываем неудачную оплату
    if (status === 'failed' || status === 'cancelled') {
      await prisma.booking.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
        },
      })

      console.log('❌ Payment failed or cancelled:', orderId)
      return new Response('OK', { status: 200 })
    }

    console.log('⚠️ Unknown payment status:', status)
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// GET - для проверки что endpoint доступен
export async function GET() {
  return Response.json({
    message: 'PayKeeper webhook endpoint',
    status: 'active',
  })
}
