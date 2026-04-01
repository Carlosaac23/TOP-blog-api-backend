import type { Request, Response } from 'express';

import type { Comment } from '@/schemas/commentSchema.js';

import { formatErrors } from '@/helpers/errors.js';
import { prisma } from '@/lib/prisma.js';
import { CreateCommentSchema } from '@/schemas/commentSchema.js';

export async function createComment(req: Request, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(formatErrors('unauthorized', 'Unauthorized'));

    const postIdParam = req.params['postId'];
    if (typeof postIdParam !== 'string') {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    const result = CreateCommentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    await prisma.comment.create({
      data: {
        content: result.data.content,
        userId,
        postId: postIdParam,
      },
    });

    res.status(201).json({ messsage: 'Comment created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function getCommentsByPost(req: Request, res: Response) {
  try {
    const { postId } = req.params;

    const comments: Comment[] = await prisma.comment.findMany({
      where: { postId: postId as string },
      include: { user: { select: { firstName: true, lastName: true, username: true } } },
    });

    res.json(comments);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function updateComment(req: Request, res: Response) {
  try {
    const userId = req.user?.sub;
    const { commentId } = req.params;

    if (!userId) {
      return res.status(401).json(formatErrors('unauthorized', 'Unauthorized'));
    }

    const comment: Comment | null = await prisma.comment.findUnique({
      where: { id: commentId as string },
    });

    if (!comment) {
      return res.status(404).json(formatErrors('not_found', 'Comment not found'));
    }

    if (userId !== comment?.userId) {
      return res.status(403).json(formatErrors('forbidden', 'Not allowed to do this'));
    }

    const result = CreateCommentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    await prisma.comment.update({ where: { id: commentId as string }, data: result.data });

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const userId = req.user?.sub;
    const { commentId } = req.params;

    if (!userId) {
      return res.status(401).json(formatErrors('unauthorized', 'Unauthorized'));
    }

    const comment: Comment | null = await prisma.comment.findUnique({
      where: { id: commentId as string },
    });

    if (!comment) {
      return res.status(404).json(formatErrors('not_found', 'Comment not found'));
    }

    if (comment.userId !== userId) {
      return res.status(403).json(formatErrors('forbidden', 'Not allowed to do this'));
    }

    await prisma.comment.delete({ where: { id: commentId as string } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
