import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, DollarSign, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [totalBookings, paidBookings, totalSlots, activeSlots] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PAID' } }),
    prisma.slot.count(),
    prisma.slot.count({ where: { status: 'ACTIVE' } }),
  ])

  const totalRevenue = await prisma.booking.aggregate({
    where: { status: 'PAID' },
    _sum: { totalAmount: true },
  })

  return {
    totalBookings,
    paidBookings,
    totalSlots,
    activeSlots,
    totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
  }
}

async function getRecentBookings() {
  return await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      slot: {
        include: {
          tariff: true,
        },
      },
    },
  })
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentBookings = await getRecentBookings()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <p className="text-muted-foreground">Обзор системы бронирования</p>
      </div>

      {/* Статистика */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Всего бронирований</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Оплаченные</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paidBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Активных слотов</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSlots}</div>
            <p className="text-xs text-muted-foreground">из {stats.totalSlots} всего</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
              }).format(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Последние бронирования */}
      <Card>
        <CardHeader>
          <CardTitle>Последние бронирования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{booking.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.slot.date).toLocaleDateString('ru-RU')} в {booking.slot.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0,
                    }).format(Number(booking.totalAmount))}
                  </p>
                  <p
                    className={`text-sm ${
                      booking.status === 'PAID'
                        ? 'text-green-600'
                        : booking.status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {booking.status === 'PAID' ? 'Оплачено' : booking.status === 'PENDING' ? 'Ожидает оплаты' : booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
