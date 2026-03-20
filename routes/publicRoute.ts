import { Router } from 'express';

import { home } from '../controllers/publicController.js';

export const publicRoutes: Router = Router();

publicRoutes.get('/', home);
