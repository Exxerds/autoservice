import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wrench, User, LogOut, Menu, X, Calendar } from 'lucide-react';

function Header() {
  const { client, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-2 py-1 font-medium transition-colors ${
      isActive 
        ? 'text-primary-600' 
        : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Лого */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform">
              <Wrench size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">АвтоСервис</div>
              <div className="text-xs text-gray-500 leading-tight">Профессионально</div>
            </div>
          </Link>

          {/* Меню (desktop) */}
          <nav className="hidden lg:flex gap-8">
            <NavLink to="/" end className={linkClass}>Главная</NavLink>
            <NavLink to="/services" className={linkClass}>Услуги</NavLink>
            <NavLink to="/locations" className={linkClass}>Адреса</NavLink>
            <NavLink to="/booking" className={linkClass}>Запись</NavLink>
          </nav>

          {/* Кнопки (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {client ? (
              <>
                <Link
                  to="/cabinet"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all font-medium"
                >
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="text-sm">{client.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Выйти"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/booking"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 transition-all hover:scale-105 active:scale-95"
                >
                  <Calendar size={16} />
                  Записаться
                </Link>
              </>
            )}
          </div>

          {/* Бургер (mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile меню */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            <nav className="flex flex-col gap-2">
              <NavLink to="/" end onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Главная</NavLink>
              <NavLink to="/services" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Услуги</NavLink>
              <NavLink to="/locations" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Адреса</NavLink>
              <NavLink to="/booking" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Запись</NavLink>
              
              <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
                {client ? (
                  <>
                    <Link to="/cabinet" onClick={() => setMobileOpen(false)} className="px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium flex items-center gap-2">
                      <User size={18} />
                      {client.name}
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2">
                      <LogOut size={18} />
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium text-center">
                      Войти
                    </Link>
                    <Link to="/booking" onClick={() => setMobileOpen(false)} className="px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold text-center">
                      Записаться
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;