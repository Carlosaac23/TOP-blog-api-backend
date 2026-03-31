import cors from 'cors';
import express from 'express';

import passport from '@/config/passport.js';
import { authRoutes } from '@/routes/authRoute.js';
import { commentRoutes } from '@/routes/commentRoute.js';
import { postRoutes } from '@/routes/postRoute.js';
import { userRoutes, writerRoutes } from '@/routes/subjectRoute.js';

const app = express();

app.use(cors());
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
