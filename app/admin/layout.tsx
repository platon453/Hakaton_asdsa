import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Auth } from '@/lib/auth'
import { LogOut, Calendar, DollarSign, Users, LayoutDashboard } from 'lucide-react'

async function AdminNav() {
  const handleLogout = async () => {
    'use server'
    await Auth.destroySession()
    redirect('/admin/login')
  }

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-bold text-xl text-primary">
              🦙 Админка ЛуЛу
            </Link>
            <div className="flex gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                Дашборд
              </Link>
              <Link
                href="/admin/slots"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <Calendar className="h-4 w-4" />
                Слоты
              </Link>
              <Link
                href="/admin/bookings"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <Users className="h-4 w-4" />
                Бронирования
              </Link>
              <Link
                href="/admin/tariffs"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <DollarSign className="h-4 w-4" />
                Тарифы
              </Link>
            </div>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Выход
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Проверка авторизации происходит в middleware
  // Здесь просто рендерим layout

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
