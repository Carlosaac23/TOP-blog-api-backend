import { Router } from 'express';
import passport from 'passport';

import { createUser, updateUser, deleteUser, getUsers } from '@/controllers/userController.js';

export const userRoutes: Router = Router();

userRoutes.route('/').get(getUsers).post(createUser);
userRoutes.put('/:userId', passport.authenticate('jwt', { session: false }), updateUser);
userRoutes.delete('/:userId', passport.authenticate('jwt', { session: false }), deleteUser);
