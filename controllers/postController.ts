import type { Request, Response } from 'express';

import { prisma } from '@/lib/prisma.js';

export async function createPost(req: Request, res: Response) {
  try {
    const writerId = req.user?.sub;
    console.log(req.user);

    if (!writerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        writerId,
      },
    });

    res.json(post);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function getPosts(_req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        writer: {
          omit: {
            password: true,
            birthDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function getPost(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findFirst({ where: { id: postId as string } });

    if (!post) {
      return res.status(401).json({ message: 'Post does not exist' });
    }

    res.json(post);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const postIdParam = req.params['postId'];
    if (typeof postIdParam !== 'string') {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        userId,
        postId: postIdParam,
      },
    });

    res.json(comment);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
