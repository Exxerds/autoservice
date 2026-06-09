import { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Location, Service } from '../../types';
import { CheckCircle2, Calendar, User, Phone, Mail, MapPin, Wrench, Loader2 } from 'lucide-react';

function Booking() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [form, setForm] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    location_id: '',
    service_id: '',
    datetime: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Location[]>('/locations'),
      api.get<Service[]>('/services'),
    ]).then(([locRes, servRes]) => {
      setLocations(locRes.data);
      setServices(servRes.data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/bookings', {
        client_name: form.client_name,
        client_phone: form.client_phone,
        client_email: form.client_email || null,
        location_id: Number(form.location_id),
        service_id: Number(form.service_id),
        datetime: form.datetime,
      });

      setSuccess(true);
      setForm({
        client_name: '',
        client_phone: '',
        client_email: '',
        location_id: '',
        service_id: '',
        datetime: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 animate-slide-down">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Заявка принята!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Мы свяжемся с вами в ближайшие 15 минут для подтверждения записи.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-600/30"
          >
            Записаться ещё
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-primary-900 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 border border-white/20">
            <Calendar size={14} />
            <span>Онлайн-запись</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Записаться на сервис</h1>
          <p className="text-lg text-gray-300">
            Заполните форму — перезвоним за 15 минут
          </p>
        </div>
      </section>

      {/* Форма */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 space-y-5 border border-gray-100"
          >
            {/* Имя */}
            <FormField label="Ваше имя" required icon={<User size={18} />}>
              <input
                type="text"
                name="client_name"
                value={form.client_name}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Иван Иванов"
              />
            </FormField>

            {/* Телефон */}
            <FormField label="Телефон" required icon={<Phone size={18} />}>
              <input
                type="tel"
                name="client_phone"
                value={form.client_phone}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="+7 (999) 123-45-67"
              />
            </FormField>

            {/* Email */}
            <FormField label="Email (необязательно)" icon={<Mail size={18} />}>
              <input
                type="email"
                name="client_email"
                value={form.client_email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="example@mail.ru"
              />
            </FormField>

            {/* Точка */}
            <FormField label="Автосервис" required icon={<MapPin size={18} />}>
              <select
                name="location_id"
                value={form.location_id}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Выберите точку</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} — {loc.address}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Услуга */}
            <FormField label="Услуга" required icon={<Wrench size={18} />}>
              <select
                name="service_id"
                value={form.service_id}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Выберите услугу</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {parseFloat(s.price).toLocaleString('ru-RU')} ₽
                  </option>
                ))}
              </select>
            </FormField>

            {/* Дата */}
            <FormField label="Дата и время" required icon={<Calendar size={18} />}>
              <input
                type="datetime-local"
                name="datetime"
                value={form.datetime}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </FormField>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-down">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-600/30 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Calendar size={20} />
                  Записаться
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

// Универсальный компонент поля с иконкой
function FormField({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

export default Booking;