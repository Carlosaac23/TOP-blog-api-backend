import { Router } from 'express';

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import requireRole from '../middleware/requireRole.js';
import verifyToken from '../middleware/verifyToken.js';

export const postRoutes: Router = Router();

postRoutes
  .route('/')
  .get(verifyToken, requireRole('user', 'writer'), getPosts)
  .post(verifyToken, requireRole('writer'), createPost);
postRoutes
  .route('/:postId')
  .get(verifyToken, requireRole('user', 'writer'), getPost)
  .put(verifyToken, requireRole('writer'), updatePost)
  .delete(verifyToken, requireRole('writer'), deletePost);
