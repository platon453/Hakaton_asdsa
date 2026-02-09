import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

async function getBookings() {
  return await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      slot: {
        include: {
          tariff: true,
        },
      },
    },
    take: 50,
  })
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Оплачено</Badge>
      case 'PENDING':
        return <Badge variant="warning">Ожидает оплаты</Badge>
      case 'CANCELLED':
        return <Badge variant="danger">Отменено</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Бронирования</h1>
        <p className="text-muted-foreground">Управление бронированиями</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все бронирования ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Клиент</th>
                  <th className="pb-3 font-medium">Дата экскурсии</th>
                  <th className="pb-3 font-medium">Билеты</th>
                  <th className="pb-3 font-medium">Сумма</th>
                  <th className="pb-3 font-medium">Статус</th>
                  <th className="pb-3 font-medium">Создано</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 text-sm font-mono">
                      {booking.id.slice(0, 8)}
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{booking.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.user.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">
                          {new Date(booking.slot.date).toLocaleDateString('ru-RU')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.slot.time}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.slot.tariff.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">
                        {booking.adultTickets > 0 && (
                          <div>Взрослых: {booking.adultTickets}</div>
                        )}
                        {booking.childTickets > 0 && (
                          <div>Детских: {booking.childTickets}</div>
                        )}
                        {booking.infantTickets > 0 && (
                          <div>До 3 лет: {booking.infantTickets}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 font-medium">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                      }).format(Number(booking.totalAmount))}
                    </td>
                    <td className="py-3">{getStatusBadge(booking.status)}</td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
