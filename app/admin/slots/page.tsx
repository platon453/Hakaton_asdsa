import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getSlots() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return await prisma.slot.findMany({
    where: {
      date: {
        gte: today,
      },
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    include: {
      tariff: true,
      _count: {
        select: { bookings: true },
      },
    },
    take: 100,
  })
}

export default async function SlotsPage() {
  const slots = await getSlots()

  const getStatusBadge = (slot: any) => {
    if (slot.status === 'BLOCKED') {
      return <Badge variant="danger">Заблокирован</Badge>
    }
    if (slot.status === 'FULL' || slot.availableCapacity === 0) {
      return <Badge variant="warning">Заполнен</Badge>
    }
    const percentage = (slot.availableCapacity / slot.totalCapacity) * 100
    if (percentage > 50) {
      return <Badge variant="success">Доступно</Badge>
    }
    return <Badge variant="warning">Мало мест</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Слоты</h1>
          <p className="text-muted-foreground">Управление слотами бронирования</p>
        </div>
        <Link href="/admin/slots/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать слот
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ближайшие слоты ({slots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-medium">Дата</th>
                  <th className="pb-3 font-medium">Время</th>
                  <th className="pb-3 font-medium">Тариф</th>
                  <th className="pb-3 font-medium">Вместимость</th>
                  <th className="pb-3 font-medium">Бронирований</th>
                  <th className="pb-3 font-medium">Статус</th>
                  <th className="pb-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">
                      {new Date(slot.date).toLocaleDateString('ru-RU', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-3">{slot.time}</td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{slot.tariff.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0,
                          }).format(Number(slot.tariff.adultPrice))}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">
                        <span className="font-medium">{slot.availableCapacity}</span>
                        <span className="text-muted-foreground">
                          {' '}
                          / {slot.totalCapacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (slot.availableCapacity / slot.totalCapacity) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3">{slot._count.bookings}</td>
                    <td className="py-3">{getStatusBadge(slot)}</td>
                    <td className="py-3">
                      <Link href={`/admin/slots/${slot.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Редактировать
                        </Button>
                      </Link>
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
