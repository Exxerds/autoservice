import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';
import type { Manager } from '../types';

interface CrmAuthContextType {
  manager: Manager | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const CrmAuthContext = createContext<CrmAuthContextType | undefined>(undefined);

export function CrmAuthProvider({ children }: { children: ReactNode }) {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => setManager(res.data))
        .catch(() => {
          localStorage.removeItem('crm_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('crm_token', res.data.token);
    setManager(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    setManager(null);
  };

  return (
    <CrmAuthContext.Provider value={{ manager, loading, login, logout }}>
      {children}
    </CrmAuthContext.Provider>
  );
}

export function useCrmAuth() {
  const context = useContext(CrmAuthContext);
  if (!context) {
    throw new Error('useCrmAuth должен использоваться внутри CrmAuthProvider');
  }
  return context;
}