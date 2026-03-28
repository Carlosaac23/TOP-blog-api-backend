import { Router } from 'express';

import { login } from '@/controllers/authController.js';
import { getUser } from '@/controllers/userController.js';
import verifyToken from '@/middleware/verifyToken.js';

export const authRoutes: Router = Router();

authRoutes.post('/', login);
authRoutes.get('/profile', verifyToken, getUser);
