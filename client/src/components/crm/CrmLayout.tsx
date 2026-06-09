import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCrmAuth } from '../../context/CrmAuthContext';
import Sidebar from './Sidebar';

function CrmLayout() {
  const { manager, loading } = useCrmAuth();
  const navigate = useNavigate();

  // Если не авторизован — на страницу входа CRM
  useEffect(() => {
    if (!loading && !manager) {
      navigate('/crm/login');
    }
  }, [manager, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  if (!manager) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default CrmLayout;