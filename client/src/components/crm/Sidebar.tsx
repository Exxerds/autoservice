import { NavLink, useNavigate } from 'react-router-dom';
import { useCrmAuth } from '../../context/CrmAuthContext';
import { LayoutDashboard, Target, CheckSquare, LogOut, Wrench, Shield } from 'lucide-react';

function Sidebar() {
  const { manager, logout } = useCrmAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/crm/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      isActive
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col min-h-screen border-r border-white/5">
      {/* Лого */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Wrench size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">CRM</h1>
            <p className="text-xs text-gray-400 leading-tight">АвтоСервис</p>
          </div>
        </div>
      </div>

      {/* Профиль */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
            {manager?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{manager?.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              {manager?.role === 'admin' ? (
                <>
                  <Shield size={12} className="text-yellow-400" />
                  Администратор
                </>
              ) : (
                <>👤 Менеджер</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Меню */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">
          Меню
        </p>
        <NavLink to="/crm" end className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Дашборд</span>
        </NavLink>
        <NavLink to="/crm/leads" className={linkClass}>
          <Target size={20} />
          <span>Лиды</span>
        </NavLink>
        <NavLink to="/crm/tasks" className={linkClass}>
          <CheckSquare size={20} />
          <span>Задачи</span>
        </NavLink>
      </nav>

      {/* Выход */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;