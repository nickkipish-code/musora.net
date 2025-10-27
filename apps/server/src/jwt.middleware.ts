import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth || Array.isArray(auth)) return next();
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return next();
  const token = parts[1];
  try {
    const secret = process.env.API_JWT_SECRET || 'secret';
    const payload = jwt.verify(token, secret);
    // attach to request
    (req as any).user = payload;
  } catch (e) {
    // ignore invalid token
  }
  return next();
}


