import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';

// Генерация JWT токена
const generateToken = (id: number, role: string, location_id: number | null) => {
  const secret: jwt.Secret = process.env.JWT_SECRET as string;
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  };
  
  return jwt.sign({ id, role, location_id }, secret, options);
};

// ========================
// Регистрация нового менеджера
// ========================
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, location_id } = req.body;

  // Проверка обязательных полей
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Заполните все обязательные поля' });
    return;
  }

  try {
    // Проверяем — нет ли уже такого email
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      res.status(400).json({ error: 'Email уже используется' });
      return;
    }

    // Шифруем пароль (10 — сложность хеширования)
    const password_hash = await bcrypt.hash(password, 10);

    // Сохраняем пользователя в БД
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, location_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, location_id`,
      [name, email, password_hash, role || 'manager', location_id || null]
    );

    const user = result.rows[0];

    // Генерируем токен
    const token = generateToken(user.id, user.role, user.location_id);

    res.status(201).json({
      message: 'Пользователь создан',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location_id: user.location_id,
      },
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Вход в систему
// ========================
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Введите email и пароль' });
    return;
  }

  try {
    // Ищем пользователя по email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Неверный email или пароль' });
      return;
    }

    const user = result.rows[0];

    // Сравниваем пароль с хешем
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ error: 'Неверный email или пароль' });
      return;
    }

    // Генерируем токен
    const token = generateToken(user.id, user.role, user.location_id);

    res.json({
      message: 'Вход выполнен',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location_id: user.location_id,
      },
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Получить текущего пользователя
// ========================
export const getMe = async (req: Request, res: Response): Promise<void> => {
  // req.user заполняется в middleware
  const userId = (req as any).user?.id;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, location_id FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};