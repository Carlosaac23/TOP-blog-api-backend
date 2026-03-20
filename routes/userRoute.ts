import { Router } from 'express';

import { createUser, updateUser, deleteUser } from '../controllers/userController.js';

export const userRoutes: Router = Router();

userRoutes.post('/', createUser);
userRoutes.put('/:userId', updateUser);
userRoutes.delete('/:userId', deleteUser);
