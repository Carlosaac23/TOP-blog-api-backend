import type { Response, Request } from 'express';

import type { Writer } from '../schemas/writerSchema.js';

import { generateHashedPassword } from '../helpers/password.js';
import { prisma } from '../lib/prisma.js';
import { CreateWriterSchema } from '../schemas/writerSchema.js';

export async function createWriter(req: Request, res: Response) {
  try {
    const result = CreateWriterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { password, ...restWriter } = result.data;

    const writer = await prisma.writer.create({
      data: {
        password: await generateHashedPassword(password),
        ...restWriter,
      },
    });

    const { password: _hashedPassword, ...writerResponse } = writer;

    res.json({ message: 'Writer successfully created', user: writerResponse });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function updateWriter(req: Request, res: Response) {
  try {
    const { writerId } = req.params;
    const result = CreateWriterSchema.safeParse(req.body);
    const writer: Writer | null = await prisma.writer.findUnique({
      where: { id: writerId as string },
    });

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    if (!writer) {
      return res.status(401).json({ message: 'Writer does not exist' });
    }

    const updatedWriter = await prisma.writer.update({
      where: { id: writerId as string },
      data: result.data,
    });

    const { password: _hashedPassword, ...safeWriter } = updatedWriter;

    res.json({ message: 'Writer successfully updated', safeWriter });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function deleteWriter(req: Request, res: Response) {
  try {
    const { writerId } = req.params;
    const writer: Writer | null = await prisma.writer.findUnique({
      where: { id: writerId as string },
    });

    if (!writer) {
      return res.status(401).json({ message: 'Writer does not exist' });
    }

    await prisma.writer.delete({ where: { id: writerId as string } });

    res.json({ message: 'Writer successfully deleted' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
