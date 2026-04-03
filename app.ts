import type { Express } from 'express';

import cors, { type CorsOptions } from 'cors';
import express from 'express';

import passport from './config/passport.js';
import { authRoutes } from './routes/authRoute.js';
import { commentRoutes } from './routes/commentRoute.js';
import { postRoutes } from './routes/postRoute.js';
import { userRoutes, writerRoutes } from './routes/subjectRoute.js';

const app: Express = express();

const allowedOrigins = process.env['ALLOWED_ORIGINS']
  ?.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/writers', writerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/comments', commentRoutes);

app.listen(process.env['PORT'], error => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log(`Server started at http://localhost:${process.env['PORT']}`);
});
