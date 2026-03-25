import type { Request, Response } from 'express';

import type { Post } from '@/schemas/postSchema.js';

import { prisma } from '@/lib/prisma.js';
import { CreatePostSchema, UpdatePostSchema } from '@/schemas/postSchema.js';

export async function createPost(req: Request, res: Response) {
  try {
    const writerId = req.user?.sub;
    const newPost = CreatePostSchema.safeParse(req.body);

    if (!newPost.success) {
      return res.status(400).json({ errors: newPost.error.issues });
    }

    if (!writerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await prisma.post.create({
      data: {
        ...newPost.data,
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
    const posts: Post[] = await prisma.post.findMany({
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
    const post: Post | null = await prisma.post.findFirst({ where: { id: postId as string } });

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

export async function updatePost(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    const post: Post | null = await prisma.post.findUnique({ where: { id: postId as string } });
    const newPost = UpdatePostSchema.safeParse(req.body);

    if (!post) {
      return res.status(401).json({ message: 'Post does not exist' });
    }

    if (!newPost.success) {
      return res.status(400).json({ errors: newPost.error.issues });
    }

    const cleanData = Object.fromEntries(
      Object.entries(newPost.data).filter(([, value]) => value !== undefined)
    );

    const updatedPost = await prisma.post.update({
      where: { id: postId as string },
      data: cleanData,
    });

    res.json({ message: 'Post successfully updated', updatedPost });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    const post: Post | null = await prisma.post.findUnique({ where: { id: postId as string } });

    if (!post) {
      return res.status(401).json({ message: 'Post does not exist' });
    }

    await prisma.post.delete({ where: { id: postId as string } });

    res.json({ message: 'Post succesfully deleted' });
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
