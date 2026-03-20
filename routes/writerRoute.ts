import { Router } from 'express';

import { createWriter, updateWriter, deleteWriter } from '../controllers/writerController.js';

export const writerRoutes: Router = Router();

writerRoutes.post('/', createWriter);
writerRoutes.put('/:writerId', updateWriter);
writerRoutes.delete(':/writerId', deleteWriter);
