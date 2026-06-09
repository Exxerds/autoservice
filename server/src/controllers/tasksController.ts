import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/auth';

// ========================
// Получить задачи (с фильтрами)
// ========================
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, assigned_to, my } = req.query;

  try {
    let query = `
      SELECT 
        t.*,
        u1.name AS assigned_name,
        u2.name AS creator_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let i = 1;

    // Фильтр: только мои задачи
    if (my === 'true') {
      query += ` AND t.assigned_to = $${i}`;
      params.push(req.user?.id);
      i++;
    }

    if (status) {
      query += ` AND t.status = $${i}`;
      params.push(status);
      i++;
    }

    if (assigned_to) {
      query += ` AND t.assigned_to = $${i}`;
      params.push(assigned_to);
      i++;
    }

    query += ` ORDER BY t.deadline ASC NULLS LAST, t.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения задач:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Получить задачу по ID
// ========================
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        t.*,
        u1.name AS assigned_name,
        u2.name AS creator_name
       FROM tasks t
       LEFT JOIN users u1 ON t.assigned_to = u1.id
       LEFT JOIN users u2 ON t.created_by = u2.id
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Задача не найдена' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Создать задачу
// ========================
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, assigned_to, deadline } = req.body;
  const createdBy = req.user?.id;

  if (!title) {
    res.status(400).json({ error: 'Введите название задачи' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, assigned_to, created_by, deadline)
       VALUES ($1, $2, 'todo', $3, $4, $5)
       RETURNING *`,
      [
        title,
        description || null,
        assigned_to || createdBy,  // если не назначен — на себя
        createdBy,
        deadline || null,
      ]
    );

    res.status(201).json({
      message: 'Задача создана',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Обновить задачу (общий метод)
// ========================
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, status, assigned_to, deadline } = req.body;

  try {
    // Проверим, существует ли задача
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Задача не найдена' });
      return;
    }

    const current = existing.rows[0];

    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, 
           description = $2, 
           status = $3, 
           assigned_to = $4, 
           deadline = $5
       WHERE id = $6
       RETURNING *`,
      [
        title ?? current.title,
        description ?? current.description,
        status ?? current.status,
        assigned_to ?? current.assigned_to,
        deadline ?? current.deadline,
        id,
      ]
    );

    res.json({
      message: 'Задача обновлена',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка обновления задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Обновить только статус задачи
// ========================
export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['todo', 'in_progress', 'done'];

  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: 'Недопустимый статус' });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Задача не найдена' });
      return;
    }

    res.json({
      message: 'Статус обновлён',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ========================
// Удалить задачу
// ========================
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Задача не найдена' });
      return;
    }

    res.json({ message: 'Задача удалена' });
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};