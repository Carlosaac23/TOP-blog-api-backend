import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import type { AuthRole } from '@/types/index.js';

import { formatErrors } from '@/helpers/errors.js';

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json(formatErrors('unauthorized', 'No token povided'));
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string);
    req.user = decoded as { sub: string; role: AuthRole };
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(401).json(formatErrors('unauthorized', 'Invalid token'));
  }
}
