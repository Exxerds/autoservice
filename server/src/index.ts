import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

// Импортируем маршруты
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import bookingRoutes from './routes/bookings';
import leadsRoutes from './routes/leads';
import tasksRoutes from './routes/tasks';

dotenv.config();

const app = express();

// CORS — разрешаем запросы с фронтенда
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/tasks', tasksRoutes);

// Проверка сервера
app.get('/', (req, res) => {
  res.json({ message: 'Сервер работает ✅' });
});

// Проверка БД
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка подключения к БД' });
  }
});

// Список точек
app.get('/api/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Список услуг
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Запуск сервера — только один раз и в самом конце!
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});