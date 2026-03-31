import type { Request, Response, NextFunction } from 'express';

import type { AuthRole } from '@/types/index.js';

import { formatErrors } from '@/helpers/errors.js';

export default function requireRole(...allowedRoles: AuthRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json(formatErrors('unauthorized', 'Unauthorized'));
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json(formatErrors('forbidden', 'Forbidden'));
    }

    next();
  };
}
