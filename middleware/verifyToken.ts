import { configDotenv } from 'dotenv';
configDotenv({ path: '.env.local' });

import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import type { AuthRole } from '@/types/index.js';

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string);
    req.user = decoded as { sub: string; role: AuthRole };
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}
