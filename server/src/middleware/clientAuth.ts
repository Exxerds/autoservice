import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface ClientAuthRequest extends Request {
  user?: {
    id: number;
    type: string;
  };
}

export const clientAuthMiddleware = (
  req: ClientAuthRequest,
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
      type: string;
    };

    if (decoded.type !== 'client') {
      res.status(403).json({ error: 'Доступ только для клиентов' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Токен недействителен' });
  }
};