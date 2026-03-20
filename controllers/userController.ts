import type { Response, Request } from 'express';

import type { User } from '../schemas/userSchema.js';

import { generateHashedPassword } from '../helpers/password.js';
import { prisma } from '../lib/prisma.js';
import { UserCreateSchema } from '../schemas/userSchema.js';

export async function createUser(req: Request, res: Response) {
  try {
    const result = UserCreateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { password, ...restUser } = result.data;

    const user = await prisma.user.create({
      data: {
        password: await generateHashedPassword(password),
        ...restUser,
      },
    });

    const { password: _hashedPassword, ...userResponse } = user;

    res.json({ message: 'User successfully created', user: userResponse });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const result = UserCreateSchema.safeParse(req.body);
    const user: User | null = await prisma.user.findUnique({ where: { id: userId as string } });

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    if (!user) {
      return res.status(401).json({ message: 'User does not exist' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId as string },
      data: result.data,
    });

    const { password: _hashedPassword, ...safeUser } = updatedUser;

    res.json({ message: 'User successfully updated', safeUser });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user: User | null = await prisma.user.findUnique({ where: { id: userId as string } });

    if (!user) {
      return res.status(401).json({ message: 'User does not exist' });
    }

    await prisma.user.delete({ where: { id: userId as string } });

    res.json({ message: 'User successfully deleted' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
