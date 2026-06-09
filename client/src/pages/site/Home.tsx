import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Clock, 
  Shield, 
  CircleDollarSign, 
  ArrowRight,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

function Home() {
  return (
    <div className="animate-fade-in">
      {/* ============ HERO ============ */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-24 overflow-hidden">
        {/* Декоративные круги */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Открыто сейчас • Принимаем заявки</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Профессиональный<br/>
              <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                ремонт авто
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Современное оборудование, опытные мастера и честные цены. 
              Запишитесь онлайн за 1 минуту.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-2xl shadow-primary-600/40 hover:scale-105 active:scale-95"
              >
                <Calendar size={20} />
                Записаться онлайн
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Все услуги
              </Link>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg">
              <div>
                <div className="text-3xl font-bold text-primary-300">10+</div>
                <div className="text-sm text-gray-400 mt-1">лет опыта</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-300">5000+</div>
                <div className="text-sm text-gray-400 mt-1">клиентов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-300">100%</div>
                <div className="text-sm text-gray-400 mt-1">гарантия</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ПРЕИМУЩЕСТВА ============ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Почему мы
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Сервис, которому<br/>доверяют тысячи клиентов
            </h2>
            <p className="text-gray-600 text-lg">
              Мы предлагаем полный комплекс услуг по обслуживанию автомобилей
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Clock size={28} />}
              title="Быстро"
              description="Большинство работ выполняем за 1 день. Не теряем ваше время."
              color="bg-blue-500"
            />
            <FeatureCard
              icon={<CircleDollarSign size={28} />}
              title="Честные цены"
              description="Прозрачное ценообразование. Никаких скрытых платежей и навязанных услуг."
              color="bg-green-500"
            />
            <FeatureCard
              icon={<Shield size={28} />}
              title="Гарантия"
              description="Гарантия на все виды работ до 12 месяцев. Уверены в качестве."
              color="bg-purple-500"
            />
          </div>
        </div>
      </section>

      {/* ============ КАК МЫ РАБОТАЕМ ============ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Как это работает
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              4 простых шага
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <StepCard num="1" title="Запись" description="Оставьте заявку на сайте за 1 минуту" icon={<Calendar size={24} />} />
            <StepCard num="2" title="Звонок" description="Мы свяжемся для подтверждения времени" icon={<Phone size={24} />} />
            <StepCard num="3" title="Визит" description="Приезжайте к назначенному времени" icon={<MapPin size={24} />} />
            <StepCard num="4" title="Готово" description="Получите авто в идеальном состоянии" icon={<CheckCircle2 size={24} />} />
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Wrench size={400} className="absolute -right-20 -bottom-20 rotate-12" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Готовы записаться?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Выберите удобную точку и время. Перезвоним в течение 15 минут.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95"
          >
            <Calendar size={20} />
            Записаться сейчас
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ============ КОМПОНЕНТЫ ============

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
}) {
  return (
    <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className={`inline-flex items-center justify-center w-14 h-14 ${color} text-white rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ 
  num, 
  title, 
  description, 
  icon 
}: { 
  num: string; 
  title: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <span className="text-5xl font-extrabold text-primary-100 group-hover:text-primary-200 transition-colors">
            {num}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default Home;