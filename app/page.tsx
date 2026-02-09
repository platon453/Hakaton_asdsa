import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Calendar, CreditCard, Camera, Users, Trees, Heart } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="text-center mb-32 animate-fade-in">
          <div className="inline-block mb-6">
            <span className="text-8xl">🦙</span>
          </div>
          <h1 className="text-7xl lg:text-8xl font-bold mb-6 text-gradient">
            Ферма альпак ЛуЛу
          </h1>
          <p className="text-xl lg:text-2xl text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            Забронируйте незабываемую экскурсию к нашим пушистым друзьям
          </p>
          <Link href="/booking">
            <Button size="lg" className="text-base">
              <Sparkles className="mr-2 h-5 w-5" />
              Забронировать экскурсию
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32 animate-fade-in-delay-1">
          <Card className="group">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl glass-strong glow-emerald">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-center">Гибкие тарифы</h3>
              <p className="text-secondary text-center leading-relaxed">
                Взрослые, детские билеты и бесплатный вход для малышей до 3 лет
              </p>
            </CardContent>
          </Card>
          
          <Card className="group">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl glass-strong glow-emerald">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-center">Удобное время</h3>
              <p className="text-secondary text-center leading-relaxed">
                Выбирайте удобный слот в нашем календаре бронирования
              </p>
            </CardContent>
          </Card>
          
          <Card className="group">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl glass-strong glow-emerald">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-center">Онлайн оплата</h3>
              <p className="text-secondary text-center leading-relaxed">
                Безопасная оплата картой или через СБП
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-16 animate-fade-in-delay-2">
          <h2 className="text-5xl font-bold mb-4">Почему выбирают нас?</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full glow-emerald"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto animate-fade-in-delay-3">
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="text-6xl mb-4">🦙</div>
              <h3 className="font-bold text-lg mb-2">Дружелюбные альпаки</h3>
              <p className="text-sm text-secondary">Наши питомцы обожают гостей</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="flex justify-center mb-4">
                <Camera className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Фотосессия</h3>
              <p className="text-sm text-secondary">Включена в стоимость</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Для всей семьи</h3>
              <p className="text-sm text-secondary">Интересно детям и взрослым</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="flex justify-center mb-4">
                <Trees className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">На природе</h3>
              <p className="text-sm text-secondary">Чистый воздух и красота</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
