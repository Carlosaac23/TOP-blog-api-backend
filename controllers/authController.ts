import type { Request, Response } from 'express';

import jwt, { type SignOptions } from 'jsonwebtoken';

import { validateHashedPassword } from '@/helpers/password.js';
import { prisma } from '@/lib/prisma.js';
import { LoginSchema } from '@/schemas/authSchema.js';

export async function login(req: Request, res: Response) {
  try {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { role, identifier, password } = result.data;

    const account =
      role === 'user'
        ? await prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { username: identifier }] },
          })
        : await prisma.writer.findFirst({
            where: { OR: [{ email: identifier }, { username: identifier }] },
          });

    if (!account) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await validateHashedPassword(password, account.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env['JWT_SECRET']) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    const jwtSecret = process.env['JWT_SECRET'];
    const expiresIn: SignOptions['expiresIn'] =
      (process.env['JWT_EXPIRES_IN'] as SignOptions['expiresIn']) ?? '1h';

    const token = jwt.sign({ sub: account.id, role }, jwtSecret, {
      expiresIn,
    });

    return res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
