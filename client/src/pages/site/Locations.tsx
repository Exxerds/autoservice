import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Location } from '../../types';
import { MapPin, Phone, Clock, Calendar, ArrowRight, Loader2 } from 'lucide-react';

function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Location[]>('/locations')
      .then((res) => setLocations(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 size={40} className="animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Загрузка адресов...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 border border-white/20">
            <MapPin size={14} />
            <span>{locations.length} точек по Москве</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Наши адреса</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Выберите удобный для вас автосервис и запишитесь онлайн
          </p>
        </div>
      </section>

      {/* Список адресов */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {locations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Адреса пока не добавлены</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {locations.map((loc, i) => (
                <div
                  key={loc.id}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{loc.name}</h3>
                        <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Открыто сейчас
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 text-gray-600 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                      <span>{loc.address}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                      <a href={`tel:${loc.phone}`} className="hover:text-primary-600 transition-colors">
                        {loc.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                      <span>{loc.working_hours}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <a
                      href={`tel:${loc.phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-primary-300 transition-all text-sm font-medium"
                    >
                      <Phone size={14} />
                      Позвонить
                    </a>
                    <Link
                      to="/booking"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 text-sm font-semibold shadow-md"
                    >
                      <Calendar size={14} />
                      Записаться
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

export default Locations;