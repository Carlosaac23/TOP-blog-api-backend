import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import type { AuthRole } from '../types/index.js';

import { apiError } from '../helpers/errors.js';

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json(apiError('unauthorized', 'Missing or invalid Authorization header'));
  }

  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json(apiError('unauthorized', 'No token povided'));
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string);
    req.user = decoded as { sub: string; role: AuthRole };
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(apiError('token_expired', 'Token has expired'));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(apiError('invalid_token', 'Token is invalid'));
    }

    return res.status(500).json(apiError('internal_error', 'Authentication failed'));
  }
}
