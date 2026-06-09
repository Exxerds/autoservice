import { Request, Response } from 'express';
import pool from '../db';

// ========================
// Создать запись (онлайн с сайта)
// ========================
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const { client_id, location_id, service_id, datetime, client_name, client_phone, client_email } = req.body;

  if (!location_id || !service_id || !datetime) {
    res.status(400).json({ error: 'Заполните точку, услугу и дату' });
    return;
  }

  try {
    let finalClientId = client_id;

    if (!client_id) {
      if (!client_name || !client_phone) {
        res.status(400).json({ error: 'Укажите имя и телефон' });
        return;
      }

      const existing = await pool.query(
        'SELECT id FROM clients WHERE phone = $1',
        [client_phone]
      );

      if (existing.rows.length > 0) {
        finalClientId = existing.rows[0].id;
        
        // Обновим email, если его не было
        if (client_email) {
          await pool.query(
            'UPDATE clients SET email = COALESCE(email, $1) WHERE id = $2',
            [client_email, finalClientId]
          );
        }
      } else {
        const newClient = await pool.query(
          `INSERT INTO clients (name, phone, email) VALUES ($1, $2, $3) RETURNING id`,
          [client_name, client_phone, client_email || null]
        );
        finalClientId = newClient.rows[0].id;
      }
    }

    const booking = await pool.query(
      `INSERT INTO bookings (client_id, location_id, service_id, datetime, status)
       VALUES ($1, $2, $3, $4, 'new')
       RETURNING *`,
      [finalClientId, location_id, service_id, datetime]
    );

    const client = await pool.query(
      'SELECT name, phone, email FROM clients WHERE id = $1',
      [finalClientId]
    );

    await pool.query(
      `INSERT INTO leads (client_name, phone, email, source, status, location_id, booking_id)
       VALUES ($1, $2, $3, 'site', 'new', $4, $5)`,
      [
        client.rows[0].name,
        client.rows[0].phone,
        client.rows[0].email,
        location_id,
        booking.rows[0].id,
      ]
    );

    res.status(201).json({
      message: 'Запись создана',
      booking: booking.rows[0],
    });
  } catch (error) {
    console.error('Ошибка создания записи:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Получить записи клиента (для личного кабинета)
// ========================
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  const clientId = (req as any).user?.id;

  try {
    const result = await pool.query(
      `SELECT 
        b.id, b.datetime, b.status, b.created_at,
        l.name AS location_name, l.address AS location_address,
        s.name AS service_name, s.price AS service_price
       FROM bookings b
       JOIN locations l ON b.location_id = l.id
       JOIN services s ON b.service_id = s.id
       WHERE b.client_id = $1
       ORDER BY b.datetime DESC`,
      [clientId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};