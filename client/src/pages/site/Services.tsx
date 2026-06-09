import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Service } from '../../types';
import { Calendar, Clock, ArrowRight, Wrench, Loader2 } from 'lucide-react';

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Service[]>('/services')
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 size={40} className="animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Загрузка услуг...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 border border-white/20">
            <Wrench size={14} />
            <span>Полный спектр услуг</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Наши услуги</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Выберите услугу и запишитесь онлайн. Все цены окончательные — без скрытых платежей.
          </p>
        </div>
      </section>

      {/* Услуги */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Услуги пока не добавлены</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Иконка */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl mb-4 shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform">
                    <Wrench size={20} />
                  </div>

                  {/* Название */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h3>

                  {/* Описание */}
                  <p className="text-gray-600 text-sm mb-4 min-h-[40px] leading-relaxed">
                    {service.description || 'Профессиональное выполнение работ опытными мастерами'}
                  </p>

                  {/* Длительность */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock size={14} />
                    <span>~ {service.duration} минут</span>
                  </div>

                  {/* Цена и кнопка */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500">Стоимость</div>
                      <div className="text-2xl font-extrabold text-gray-900">
                        {parseFloat(service.price).toLocaleString('ru-RU')} <span className="text-base text-gray-500">₽</span>
                      </div>
                    </div>
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 shadow-md"
                    >
                      <Calendar size={14} />
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Services;