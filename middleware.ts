import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Защита админских маршрутов
  if (pathname.startsWith('/admin')) {
    // Разрешаем доступ к странице логина
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Проверяем наличие сессии
    const session = request.cookies.get('admin_session')

    if (!session || session.value !== 'authenticated') {
      // Редирект на страницу логина
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
