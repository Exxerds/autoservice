import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Перехватчик — добавляет правильный токен в зависимости от типа запроса
api.interceptors.request.use((config) => {
  // Для CRM-маршрутов используем токен менеджера
  const isCrmRequest = config.url?.startsWith('/leads') 
    || config.url?.startsWith('/tasks')
    || config.url?.startsWith('/auth/me');
  
  if (isCrmRequest) {
    const crmToken = localStorage.getItem('crm_token');
    if (crmToken) {
      config.headers.Authorization = `Bearer ${crmToken}`;
    }
  } else {
    const clientToken = localStorage.getItem('client_token');
    if (clientToken) {
      config.headers.Authorization = `Bearer ${clientToken}`;
    }
  }
  
  return config;
});

export default api;