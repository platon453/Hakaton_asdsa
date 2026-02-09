import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero секция */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🦙 Ферма альпак ЛуЛу
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Забронируйте незабываемую экскурсию к нашим пушистым друзьям
          </p>
          <Link href="/booking">
            <Button size="lg" className="text-lg px-8 py-6">
              Забронировать экскурсию
            </Button>
          </Link>
        </div>

        {/* Информационные карточки */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">🎟️</div>
            <h3 className="font-semibold text-lg mb-2">Гибкие тарифы</h3>
            <p className="text-gray-600">Взрослые, детские билеты и бесплатный вход для малышей до 3 лет</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-semibold text-lg mb-2">Удобное время</h3>
            <p className="text-gray-600">Выбирайте удобный слот в нашем календаре бронирования</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-lg mb-2">Онлайн оплата</h3>
            <p className="text-gray-600">Безопасная оплата картой или через СБП</p>
          </div>
        </div>

        {/* Преимущества */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Почему выбирают нас?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-3">🦙</div>
              <h3 className="font-semibold mb-2">Дружелюбные альпаки</h3>
              <p className="text-sm text-gray-600">Наши питомцы обожают гостей</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="font-semibold mb-2">Фотосессия</h3>
              <p className="text-sm text-gray-600">Включена в стоимость</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold mb-2">Для всей семьи</h3>
              <p className="text-sm text-gray-600">Интересно детям и взрослым</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-3">🌳</div>
              <h3 className="font-semibold mb-2">На природе</h3>
              <p className="text-sm text-gray-600">Чистый воздух и красота</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
