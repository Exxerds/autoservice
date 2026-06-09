import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';
import type { Client } from '../types';

interface AuthContextType {
  client: Client | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // При запуске проверяем — есть ли токен в localStorage
  useEffect(() => {
    const token = localStorage.getItem('client_token');
    if (token) {
      // Запрашиваем данные клиента
      api.get('/clients/me')
        .then((res) => setClient(res.data))
        .catch(() => {
          // Если токен невалидный — удаляем
          localStorage.removeItem('client_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone: string, password: string) => {
    const res = await api.post('/clients/login', { phone, password });
    localStorage.setItem('client_token', res.data.token);
    setClient(res.data.client);
  };

  const register = async (name: string, phone: string, email: string, password: string) => {
    const res = await api.post('/clients/register', { name, phone, email, password });
    localStorage.setItem('client_token', res.data.token);
    setClient(res.data.client);
  };

  const logout = () => {
    localStorage.removeItem('client_token');
    setClient(null);
  };

  return (
    <AuthContext.Provider value={{ client, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста в любом компоненте
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}