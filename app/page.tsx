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
          <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
            Забронировать экскурсию
          </button>
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

        {/* Временная заглушка для календаря */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-4">
            <p className="text-yellow-800">
              📅 Календарь бронирования появится на следующем этапе разработки
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
