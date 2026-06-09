import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, Lock, LogIn, UserPlus, Loader2, Wrench } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(form.name, form.phone, form.email, form.password);
      } else {
        await login(form.phone, form.password);
      }
      navigate('/cabinet');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-primary-50/30 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform">
            <Wrench size={24} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">АвтоСервис</div>
            <div className="text-xs text-gray-500">Личный кабинет</div>
          </div>
        </Link>

        {/* Карточка */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Табы */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                !isRegister
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                isRegister
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Регистрация
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isRegister ? 'Создать аккаунт' : 'Добро пожаловать!'}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {isRegister ? 'Зарегистрируйтесь, чтобы отслеживать записи' : 'Войдите, чтобы увидеть свои записи'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <InputField
                icon={<User size={18} />}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                required
              />
            )}

            <InputField
              icon={<Phone size={18} />}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              required
            />

            {isRegister && (
              <InputField
                icon={<Mail size={18} />}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email (необязательно)"
              />
            )}

            <InputField
              icon={<Lock size={18} />}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Пароль (мин. 6 символов)"
              required
              minLength={6}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm animate-slide-down">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-600/30 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                  {isRegister ? 'Зарегистрироваться' : 'Войти'}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </div>
    </div>
  );
}

function InputField({
  icon,
  ...props
}: {
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

export default Login;