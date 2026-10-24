import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'netflix_mern_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phoneNumber?: string;
    email?: string;
    name?: string;
    activeProfileId?: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    return;
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
  } catch (error) {
    // silently continue without req.user
  }
  next();
};

export const signToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
