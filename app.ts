import { configDotenv } from 'dotenv';
configDotenv({ path: '.env.local' });

import express from 'express';

import { publicRoutes } from './routes/publicRoute.js';
import { userRoutes } from './routes/userRoute.js';
import { writerRoutes } from './routes/writerRoute.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/', publicRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/writers/', writerRoutes);

app.listen(process.env.PORT, error => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log(`Server started at http://localhost:${process.env.PORT}`);
});
