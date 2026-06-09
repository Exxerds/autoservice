import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import type { Booking } from '../../types';
import { Calendar, MapPin, Wrench, Phone, Mail, LogOut, Plus, Loader2, User } from 'lucide-react';

function Cabinet() {
  const { client, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !client) {
      navigate('/login');
    }
  }, [client, authLoading, navigate]);

  useEffect(() => {
    if (client) {
      api.get<Booking[]>('/clients/me/bookings')
        .then((res) => setBookings(res.data))
        .finally(() => setLoading(false));
    }
  }, [client]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 size={40} className="animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  if (!client) return null;

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    new: { label: 'Новая', bg: 'bg-blue-100', text: 'text-blue-700' },
    confirmed: { label: 'Подтверждена', bg: 'bg-green-100', text: 'text-green-700' },
    done: { label: 'Завершена', bg: 'bg-gray-100', text: 'text-gray-700' },
    cancelled: { label: 'Отменена', bg: 'bg-red-100', text: 'text-red-700' },
  };

  return (
    <div className="animate-fade-in">
      {/* Hero с инфо о клиенте */}
      <section className="bg-gradient-to-br from-gray-900 to-primary-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl border border-white/20">
                <User size={32} />
              </div>
              <div>
                <p className="text-primary-200 text-sm">Личный кабинет</p>
                <h1 className="text-3xl font-bold">{client.name}</h1>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {client.phone}
                  </span>
                  {client.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> {client.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-red-500/80 rounded-xl border border-white/20 transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              Выйти
            </button>
          </div>
        </div>
      </section>

      {/* Записи */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Мои записи <span className="text-gray-400 text-lg">({bookings.length})</span>
            </h2>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-600/30"
            >
              <Plus size={18} />
              Новая запись
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">У вас пока нет записей</h3>
              <p className="text-gray-500 mb-6">Запишитесь на услугу — это займёт меньше минуты</p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all"
              >
                <Calendar size={18} />
                Записаться
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((b, i) => {
                const status = statusConfig[b.status] || { label: b.status, bg: 'bg-gray-100', text: 'text-gray-700' };
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30 flex-shrink-0">
                          <Wrench size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{b.service_name}</h3>
                            <span className={`px-2 py-0.5 ${status.bg} ${status.text} rounded-full text-xs font-medium`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <MapPin size={14} className="text-primary-500" />
                              {b.location_name}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar size={14} className="text-primary-500" />
                              {new Date(b.datetime).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {b.service_price && (
                        <div className="md:text-right">
                          <div className="text-xs text-gray-500">Стоимость</div>
                          <div className="text-2xl font-extrabold text-primary-600">
                            {parseFloat(b.service_price).toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Cabinet;