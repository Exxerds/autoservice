import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';

// Генерация токена для клиента
const generateClientToken = (id: number) => {
  const secret: jwt.Secret = process.env.JWT_SECRET as string;
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ id, type: 'client' }, secret, options);
};

// ========================
// Регистрация клиента
// ========================
export const registerClient = async (req: Request, res: Response): Promise<void> => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !password) {
    res.status(400).json({ error: 'Заполните имя, телефон и пароль' });
    return;
  }

  try {
    // Проверка — нет ли уже клиента с таким телефоном
    const existing = await pool.query(
      'SELECT id FROM clients WHERE phone = $1',
      [phone]
    );

    if (existing.rows.length > 0) {
      res.status(400).json({ error: 'Клиент с таким телефоном уже зарегистрирован' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO clients (name, phone, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone, email`,
      [name, phone, email || null, password_hash]
    );

    const client = result.rows[0];
    const token = generateClientToken(client.id);

    res.status(201).json({
      message: 'Клиент зарегистрирован',
      token,
      client,
    });
  } catch (error) {
    console.error('Ошибка регистрации клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Вход клиента
// ========================
export const loginClient = async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400).json({ error: 'Введите телефон и пароль' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Неверный телефон или пароль' });
      return;
    }

    const client = result.rows[0];
    const isMatch = await bcrypt.compare(password, client.password_hash);

    if (!isMatch) {
      res.status(401).json({ error: 'Неверный телефон или пароль' });
      return;
    }

    const token = generateClientToken(client.id);

    res.json({
      message: 'Вход выполнен',
      token,
      client: {
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
      },
    });
  } catch (error) {
    console.error('Ошибка входа клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Получить данные клиента (личный кабинет)
// ========================
export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  const clientId = (req as any).user?.id;

  try {
    const result = await pool.query(
      'SELECT id, name, phone, email, created_at FROM clients WHERE id = $1',
      [clientId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Клиент не найден' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};