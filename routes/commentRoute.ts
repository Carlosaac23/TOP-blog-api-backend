import { Router } from 'express';

import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from '@/controllers/commentController.js';
import requireRole from '@/middleware/requireRole.js';
import verifyToken from '@/middleware/verifyToken.js';

export const commentRoutes: Router = Router({ mergeParams: true });

commentRoutes
  .route('/')
  .get(verifyToken, requireRole('user', 'writer'), getCommentsByPost)
  .post(verifyToken, requireRole('user', 'writer'), createComment);
commentRoutes
  .route('/:commentId')
  .put(verifyToken, requireRole('user', 'writer'), updateComment)
  .delete(verifyToken, requireRole('user', 'writer'), deleteComment);
