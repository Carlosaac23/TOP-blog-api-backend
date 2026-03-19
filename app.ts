import { configDotenv } from 'dotenv';
configDotenv({ path: '.env.local' });

import type { Request, Response } from 'express';

import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(process.env.PORT, error => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log(`Server started at http://localhost:${process.env.PORT}`);
});
