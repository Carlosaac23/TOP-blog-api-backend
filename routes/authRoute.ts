import { Router } from 'express';

import { login, getSubjectProfile } from '@/controllers/authController.js';
import requireRole from '@/middleware/requireRole.js';
import verifyToken from '@/middleware/verifyToken.js';

export const authRoutes: Router = Router();

authRoutes
  .route('/')
  .get(verifyToken, requireRole('user', 'writer'), getSubjectProfile)
  .post(login);
