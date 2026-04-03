import type { Request, Response } from 'express';

import type { AuthRole, AuthSubject } from '../types/index.js';

import { Role } from '../generated/prisma/enums.js';
import { capitalize } from '../helpers/capitalize.js';
import { apiError } from '../helpers/errors.js';
import { generateHashedPassword } from '../helpers/password.js';
import { prisma } from '../lib/prisma.js';
import {
  CreateSubjectSchema,
  UpdateSubjectSchema,
  type Subject,
} from '../schemas/subjectSchema.js';

export function createSubject(subjectRole: AuthRole) {
  return async function (req: Request, res: Response) {
    const result = CreateSubjectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { password, lastName, ...restSubject } = result.data;
    const prismaRole = subjectRole === 'user' ? Role.User : Role.Writer;

    try {
      if (subjectRole === 'user') {
        await prisma.user.create({
          data: {
            ...restSubject,
            lastName: lastName ?? null,
            role: prismaRole,
            password: await generateHashedPassword(password),
          },
        });
      } else {
        await prisma.writer.create({
          data: {
            ...restSubject,
            lastName: lastName ?? null,
            role: prismaRole,
            password: await generateHashedPassword(password),
          },
        });
      }

      return res.status(201).json({ message: `${capitalize(subjectRole)} created successfully` });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: 'Unknown error ocurred' });
    }
  };
}

export function updateSubject(subjectRole: AuthRole) {
  return async function (req: Request, res: Response) {
    const idParam = subjectRole === 'user' ? 'userId' : 'writerId';
    const id = req.params[idParam];
    const result = UpdateSubjectSchema.safeParse(req.body);

    const authSubject = req.user as AuthSubject | undefined;

    if (!authSubject) {
      return res.status(401).json(apiError('unathorized', 'Authentication required'));
    }

    if (authSubject.role !== subjectRole || authSubject.sub !== id) {
      return res.status(403).json(apiError('forbidden', 'You cannot modify this account'));
    }

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const cleanData = Object.fromEntries(
      Object.entries(result.data).filter(([, value]) => value !== undefined)
    );

    if (typeof cleanData['password'] === 'string') {
      cleanData['password'] = await generateHashedPassword(cleanData['password']);
    }

    try {
      if (subjectRole === 'user') {
        const user: Subject | null = await prisma.user.findUnique({
          where: { id: id as string },
        });

        if (!user) {
          return res.status(404).json(apiError('not_found', 'User not found'));
        }

        await prisma.user.update({ where: { id }, data: cleanData });
      } else {
        const writer: Subject | null = await prisma.writer.findUnique({
          where: { id: id as string },
        });

        if (!writer) {
          return res.status(404).json(apiError('not_found', 'Writer not found'));
        }

        await prisma.writer.update({ where: { id }, data: cleanData });
      }

      return res.status(200).json({ message: `${capitalize(subjectRole)} updated successfully` });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: 'Unknown error ocurred' });
    }
  };
}

export function deleteSubject(subjectRole: AuthRole) {
  return async function (req: Request, res: Response) {
    const idParam = subjectRole === 'user' ? 'userId' : 'writerId';
    const id = req.params[idParam];
    const authSubject = req.user as AuthSubject | undefined;

    if (!authSubject) {
      return res.status(401).json(apiError('unauthorized', 'Authentication required'));
    }

    if (authSubject.role !== subjectRole || authSubject.sub !== id) {
      return res.status(403).json(apiError('forbidden', 'You cannot delete this account'));
    }

    try {
      if (subjectRole === 'user') {
        const user: Subject | null = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          return res.status(404).json(apiError('not_found', 'User not found'));
        }

        await prisma.user.delete({ where: { id } });
      } else {
        const writer: Subject | null = await prisma.writer.findUnique({
          where: { id },
        });

        if (!writer) {
          return res.status(404).json(apiError('not_found', 'Writer not found'));
        }

        await prisma.writer.delete({ where: { id } });
      }

      return res.status(200).json({ message: `${capitalize(subjectRole)} successfully deleted` });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: 'Unknown error ocurred' });
    }
  };
}
