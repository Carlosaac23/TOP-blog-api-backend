import type { Request, Response } from 'express';

import jwt, { type SignOptions } from 'jsonwebtoken';

import { apiError, validationError } from '../helpers/errors.js';
import { validateHashedPassword } from '../helpers/password.js';
import { prisma } from '../lib/prisma.js';
import { LoginSchema } from '../schemas/authSchema.js';

export async function login(req: Request, res: Response) {
  try {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(validationError(result.error.issues));
    }

    const { identifier, password, role } = result.data;

    const account =
      role === 'user'
        ? await prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { username: identifier }] },
          })
        : await prisma.writer.findFirst({
            where: { OR: [{ email: identifier }, { username: identifier }] },
          });

    if (!account) {
      return res.status(401).json(apiError('unauthorized', 'Invalid credentials'));
    }

    const validPassword = await validateHashedPassword(password, account.password);
    if (!validPassword) {
      return res.status(401).json(apiError('unauthorized', 'Invalid credentials'));
    }

    if (!process.env['JWT_SECRET']) {
      return res.status(500).json(apiError('internal_error', 'JWT secret is not configured'));
    }

    const jwtSecret = process.env['JWT_SECRET'];
    const expiresIn: SignOptions['expiresIn'] =
      (process.env['JWT_EXPIRES_IN'] as SignOptions['expiresIn']) ?? '1h';

    const token = jwt.sign(
      {
        sub: account.id,
        role,
      },
      jwtSecret,
      {
        expiresIn,
      }
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiError('internal_error', 'Internal server error'));
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
        return res.status(404).json(apiError('not_found', 'User not found'));
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
        return res.status(404).json(apiError('not_found', 'Writer not found'));
      }

      return res.status(200).json({ profile: writerProfile });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(apiError('internal_error', error.message));
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
