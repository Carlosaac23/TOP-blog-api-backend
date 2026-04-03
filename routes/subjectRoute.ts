import { Router } from 'express';

import { createSubject, updateSubject, deleteSubject } from '@/controllers/subjectController.js';
import requireRole from '@/middleware/requireRole.js';
import verifyToken from '@/middleware/verifyToken.js';

export const userRoutes: Router = Router();
export const writerRoutes: Router = Router();

// Users
userRoutes.post('/', createSubject('user'));
userRoutes.put('/:userId', verifyToken, requireRole('user'), updateSubject('user'));
userRoutes.delete('/:userId', verifyToken, requireRole('user'), deleteSubject('user'));

// Writers
writerRoutes.post('/', createSubject('writer'));
writerRoutes.put('/:writerId', verifyToken, requireRole('writer'), updateSubject('writer'));
writerRoutes.delete('/:writerId', verifyToken, requireRole('writer'), deleteSubject('writer'));
