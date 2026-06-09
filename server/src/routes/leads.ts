import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
  assignManager,
  deleteLead,
  addComment,
} from '../controllers/leadsController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';

const router = Router();

// Все маршруты доступны только авторизованным пользователям CRM
router.use(authMiddleware);

// GET /api/leads — список лидов (с фильтрами)
router.get('/', getLeads);

// GET /api/leads/:id — лид по ID
router.get('/:id', getLeadById);

// POST /api/leads — создать вручную
router.post('/', createLead);

// PATCH /api/leads/:id/status — обновить статус
router.patch('/:id/status', updateLeadStatus);

// PATCH /api/leads/:id/assign — назначить менеджера
router.patch('/:id/assign', assignManager);

// POST /api/leads/:id/comments — добавить комментарий
router.post('/:id/comments', addComment);

// DELETE /api/leads/:id — удалить (только админ)
router.delete('/:id', requireRole('admin'), deleteLead);

export default router;