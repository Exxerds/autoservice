import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Принимает список разрешённых ролей
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Не авторизован' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Нет доступа' });
      return;
    }

    next();
  };
};