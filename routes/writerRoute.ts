import { Router } from 'express';
import passport from 'passport';

import { createWriter, updateWriter, deleteWriter } from '@/controllers/writerController.js';

export const writerRoutes: Router = Router();

writerRoutes.post('/', createWriter);
writerRoutes.put('/:writerId', passport.authenticate('jwt', { session: false }), updateWriter);
writerRoutes.delete('/:writerId', passport.authenticate('jwt', { session: false }), deleteWriter);
