import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/tasksController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/tasks — все задачи (с фильтрами ?status= ?my=true)
router.get('/', getTasks);

// GET /api/tasks/:id — задача по ID
router.get('/:id', getTaskById);

// POST /api/tasks — создать задачу
router.post('/', createTask);

// PUT /api/tasks/:id — полное обновление
router.put('/:id', updateTask);

// PATCH /api/tasks/:id/status — только статус
router.patch('/:id/status', updateTaskStatus);

// DELETE /api/tasks/:id — удалить
router.delete('/:id', deleteTask);

export default router;