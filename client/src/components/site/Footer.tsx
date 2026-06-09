import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, Clock, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Лого + описание */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Wrench size={20} />
              </div>
              <div>
                <div className="font-bold text-white text-lg leading-tight">АвтоСервис</div>
                <div className="text-xs text-gray-400">Профессионально с 2014</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-md leading-relaxed">
              Сеть автосервисов с 10-летним опытом. Качественный ремонт, честные цены 
              и гарантия на все виды работ.
            </p>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs">
                ⭐ 4.9/5 на Яндекс
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs">
                🛡 Гарантия 12 мес
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-white font-bold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                <a href="tel:+74950000000" className="hover:text-white transition-colors">
                  +7 (495) 000-00-00
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                <a href="mailto:info@autoservice.ru" className="hover:text-white transition-colors">
                  info@autoservice.ru
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                <span>Ежедневно с 9:00 до 21:00</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                <span>Москва и Московская область</span>
              </li>
            </ul>
          </div>

          {/* Меню */}
          <div>
            <h4 className="text-white font-bold mb-4">Меню</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Услуги</Link></li>
              <li><Link to="/locations" className="hover:text-white transition-colors">Адреса</Link></li>
              <li><Link to="/booking" className="hover:text-white transition-colors">Запись</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Личный кабинет</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© 2026 АвтоСервис. Все права защищены.</p>
          <p>Создано с ❤️ для портфолио</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;