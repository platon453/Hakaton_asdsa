import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">ЛуЛу</h3>
            <p className="text-white/60 leading-relaxed">
              Ферма альпак в окружении соснового леса. Незабываемые встречи с природой.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Контакты</h4>
            <div className="space-y-3">
              <a 
                href="tel:+73433101219" 
                className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+7 (343) 310-12-19</span>
              </a>
              
              <a 
                href="mailto:info@alpaca-lulu.ru" 
                className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>info@alpaca-lulu.ru</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Мы в соцсетях</h4>
            <div className="flex gap-3">
              <a
                href="https://t.me/alpaca_lulu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover-lift group"
                aria-label="Telegram"
              >
                <svg 
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.306.02.472z"/>
                </svg>
              </a>
              
              <a
                href="https://vk.com/alpaca_lulu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover-lift group"
                aria-label="VK"
              >
                <svg 
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 13.163c.603.536 1.238 1.04 1.771 1.63.237.263.461.537.639.849.252.439.022.922-.407.949l-2.688-.001c-.69.056-1.237-.217-1.696-.67-.368-.363-.711-.742-1.058-1.12-.146-.16-.298-.312-.477-.437-.344-.24-.643-.173-.847.194-.208.374-.256.79-.277 1.208-.032.633-.247.798-.882.827-1.359.063-2.647-.149-3.844-.89-1.053-.65-1.86-1.545-2.577-2.54-1.398-1.944-2.47-4.063-3.431-6.248-.203-.463-.056-.712.444-.719 1.018-.014 2.035-.013 3.052.001.413.006.687.241.846.628.499 1.212 1.096 2.365 1.85 3.428.197.277.394.555.673.748.303.21.537.134.681-.21.092-.22.135-.455.157-.69.084-.871.095-1.741-.025-2.608-.079-.577-.38-.95-.956-1.048-.295-.05-.252-.146-.109-.295.271-.28.526-.455 1.038-.455h3.823c.602.119.735.39.817.995l.003 4.244c-.006.182.091.722.421.841.265.095.441-.138.6-.301.718-.738 1.23-1.615 1.694-2.52.207-.403.381-.822.545-1.244.122-.312.313-.466.663-.461l2.93.003c.087 0 .174.001.26.014.516.079.659.278.502.781-.242.776-.673 1.438-1.117 2.089-.468.685-.967 1.346-1.43 2.033-.431.638-.394 1.003.155 1.545z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2026 ЛуЛу. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/about" className="hover:text-white transition-colors">
              О нас
            </Link>
            <Link href="/booking" className="hover:text-white transition-colors">
              Бронирование
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
