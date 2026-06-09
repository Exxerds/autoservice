import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширяем тип Request — добавляем поле user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    location_id: number | null;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Токен не передан' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
      location_id: number | null;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Токен недействителен' });
  }
};