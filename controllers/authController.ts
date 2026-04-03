import type { Request, Response } from 'express';

import jwt, { type SignOptions } from 'jsonwebtoken';

import type { AuthRole } from '../types/index.js';

import { formatErrors } from '../helpers/errors.js';
import { validateHashedPassword } from '../helpers/password.js';
import { prisma } from '../lib/prisma.js';
import { LoginSchema } from '../schemas/authSchema.js';

export async function login(req: Request, res: Response) {
  try {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { identifier, password } = result.data;

    const [user, writer] = await Promise.all([
      prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } }),
      prisma.writer.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } }),
    ]);

    const userPasswordOk = user ? await validateHashedPassword(password, user.password) : false;
    const writerPasswordOk = writer
      ? await validateHashedPassword(password, writer.password)
      : false;

    if (!userPasswordOk && !writerPasswordOk) {
      return res.status(401).json(formatErrors('unauthorized', 'Invalid credentials'));
    }

    if (userPasswordOk && writerPasswordOk) {
      return res.status(409).json({
        message: 'Ambiguous account: same identifier/password exists for user and writer',
      });
    }

    const account = userPasswordOk ? user : writer;
    const role: AuthRole = userPasswordOk ? 'user' : 'writer';

    if (!process.env['JWT_SECRET']) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    const jwtSecret = process.env['JWT_SECRET'];
    const expiresIn: SignOptions['expiresIn'] =
      (process.env['JWT_EXPIRES_IN'] as SignOptions['expiresIn']) ?? '1h';

    const token = jwt.sign(
      {
        sub: account?.id,
        name: `${account?.firstName} ${account?.lastName}`,
        username: account?.username,
        email: account?.email,
        createdAt: account?.createdAt,
        role,
      },
      jwtSecret,
      {
        expiresIn,
      }
    );

    return res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function getSubjectProfile(req: Request, res: Response) {
  try {
    const { user } = req;

    if (user?.role === 'user') {
      const userProfile = await prisma.user.findUnique({
        where: { id: user?.sub as string },
        omit: {
          password: true,
          updatedAt: true,
        },
      });

      if (!userProfile) {
        return res.status(404).json(formatErrors('not_found', 'User not found'));
      }

      return res.status(200).json({ profile: userProfile });
    } else {
      const writerProfile = await prisma.writer.findUnique({
        where: { id: user?.sub as string },
        omit: {
          password: true,
          updatedAt: true,
        },
      });

      if (!writerProfile) {
        return res.status(404).json(formatErrors('not_found', 'Writer not found'));
      }

      return res.status(200).json({ profile: writerProfile });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
