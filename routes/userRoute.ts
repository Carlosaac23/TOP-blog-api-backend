import { Router } from 'express';

import { createUser, getUsers, updateUser, deleteUser } from '@/controllers/userController.js';
import verifyToken from '@/middleware/verifyToken.js';

export const userRoutes: Router = Router();

userRoutes.route('/').get(getUsers).post(createUser);
userRoutes.put('/:userId', verifyToken, updateUser);
userRoutes.delete('/:userId', verifyToken, deleteUser);
