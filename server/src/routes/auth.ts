import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/auth/register — регистрация
router.post('/register', register);

// POST /api/auth/login — вход
router.post('/login', login);

// GET /api/auth/me — получить себя (только с токеном)
router.get('/me', authMiddleware, getMe);

export default router;