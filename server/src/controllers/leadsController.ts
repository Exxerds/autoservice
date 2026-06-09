import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/auth';

// ========================
// Получить все лиды (с фильтрами)
// ========================
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, location_id, manager_id, source } = req.query;

  try {
    // Базовый запрос с JOIN на менеджера и точку
    let query = `
      SELECT 
        l.*,
        loc.name AS location_name,
        u.name AS manager_name
      FROM leads l
      LEFT JOIN locations loc ON l.location_id = loc.id
      LEFT JOIN users u ON l.manager_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    // Фильтр по статусу
    if (status) {
      query += ` AND l.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Фильтр по точке
    if (location_id) {
      query += ` AND l.location_id = $${paramIndex}`;
      params.push(location_id);
      paramIndex++;
    }

    // Фильтр по менеджеру
    if (manager_id) {
      query += ` AND l.manager_id = $${paramIndex}`;
      params.push(manager_id);
      paramIndex++;
    }

    // Фильтр по источнику
    if (source) {
      query += ` AND l.source = $${paramIndex}`;
      params.push(source);
      paramIndex++;
    }

    // Если менеджер (не админ) — показываем только лиды его точки
    if (req.user?.role === 'manager' && req.user?.location_id) {
      query += ` AND l.location_id = $${paramIndex}`;
      params.push(req.user.location_id);
      paramIndex++;
    }

    query += ` ORDER BY l.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения лидов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Получить лид по ID (с комментариями)
// ========================
export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Получаем сам лид
    const leadResult = await pool.query(
      `SELECT 
        l.*,
        loc.name AS location_name,
        loc.address AS location_address,
        u.name AS manager_name
       FROM leads l
       LEFT JOIN locations loc ON l.location_id = loc.id
       LEFT JOIN users u ON l.manager_id = u.id
       WHERE l.id = $1`,
      [id]
    );

    if (leadResult.rows.length === 0) {
      res.status(404).json({ error: 'Лид не найден' });
      return;
    }

    const lead = leadResult.rows[0];

    // Получаем комментарии
    const commentsResult = await pool.query(
      `SELECT c.*, u.name AS manager_name
       FROM lead_comments c
       LEFT JOIN users u ON c.manager_id = u.id
       WHERE c.lead_id = $1
       ORDER BY c.created_at DESC`,
      [id]
    );

    // Если у лида есть запись (booking) — подтянем данные
    let booking = null;
    if (lead.booking_id) {
      const bookingResult = await pool.query(
        `SELECT b.*, s.name AS service_name, s.price AS service_price
         FROM bookings b
         LEFT JOIN services s ON b.service_id = s.id
         WHERE b.id = $1`,
        [lead.booking_id]
      );
      booking = bookingResult.rows[0] || null;
    }

    res.json({
      ...lead,
      comments: commentsResult.rows,
      booking,
    });
  } catch (error) {
    console.error('Ошибка получения лида:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Создать лид вручную (менеджером)
// ========================
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const { client_name, phone, email, location_id, manager_id } = req.body;

  if (!client_name || !phone) {
    res.status(400).json({ error: 'Укажите имя и телефон' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO leads (client_name, phone, email, source, status, location_id, manager_id)
       VALUES ($1, $2, $3, 'manual', 'new', $4, $5)
       RETURNING *`,
      [client_name, phone, email || null, location_id || null, manager_id || req.user?.id]
    );

    res.status(201).json({
      message: 'Лид создан',
      lead: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка создания лида:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Обновить статус лида
// ========================
export const updateLeadStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['new', 'in_work', 'booked', 'done', 'rejected'];

  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: 'Недопустимый статус' });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE leads SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Лид не найден' });
      return;
    }

    res.json({
      message: 'Статус обновлён',
      lead: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Назначить менеджера на лид
// ========================
export const assignManager = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { manager_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE leads SET manager_id = $1 WHERE id = $2 RETURNING *`,
      [manager_id, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Лид не найден' });
      return;
    }

    res.json({
      message: 'Менеджер назначен',
      lead: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка назначения:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Удалить лид (только админ)
// ========================
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Удаляем сначала комментарии
    await pool.query('DELETE FROM lead_comments WHERE lead_id = $1', [id]);
    
    const result = await pool.query(
      'DELETE FROM leads WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Лид не найден' });
      return;
    }

    res.json({ message: 'Лид удалён' });
  } catch (error) {
    console.error('Ошибка удаления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Добавить комментарий к лиду
// ========================
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;
  const managerId = req.user?.id;

  if (!text) {
    res.status(400).json({ error: 'Текст комментария обязателен' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO lead_comments (lead_id, manager_id, text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, managerId, text]
    );

    res.status(201).json({
      message: 'Комментарий добавлен',
      comment: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка добавления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};