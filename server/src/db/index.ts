import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        // Production (Neon) — используем одну строку подключения
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        // Локальная разработка — используем отдельные параметры
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: false
      }
);

pool.connect()
  .then(() => console.log('✅ База данных подключена'))
  .catch((err: Error) => console.error('❌ Ошибка подключения к БД:', err));

export default pool;