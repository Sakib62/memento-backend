import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errorClass';

export interface AuthRequest extends Request {
  user: { id: string; username: string; name: string; role: number };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthorizedError();
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.user = decoded as AuthRequest['user'];
    next();
  } catch (error) {
    next(error);
  }
};
