import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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