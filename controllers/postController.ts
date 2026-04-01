import type { Request, Response } from 'express';

import type { Post } from '@/schemas/postSchema.js';

import { formatErrors } from '@/helpers/errors.js';
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
      return res.status(401).json(formatErrors('unauthorized', 'Unauthorized'));
    }

    await prisma.post.create({
      data: {
        ...newPost.data,
        writerId,
      },
    });

    return res.status(201).json({ message: 'Post created successfully' });
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

    return res.json(posts);
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
      return res.status(401).json(formatErrors('not_found', 'Post not found'));
    }

    return res.json(post);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const userId = req.user?.sub;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json(formatErrors('unauthorized', 'Unauthorized'));
    }

    const post: Post | null = await prisma.post.findUnique({ where: { id: postId as string } });

    if (!post) {
      return res.status(401).json(formatErrors('not_found', 'Post not found'));
    }

    if (post.writerId !== userId) {
      return res.status(403).json(formatErrors('forbidden', 'Not allowed to do this'));
    }

    const newPost = UpdatePostSchema.safeParse(req.body);

    if (!newPost.success) {
      return res.status(400).json({ errors: newPost.error.issues });
    }

    const cleanData = Object.fromEntries(
      Object.entries(newPost.data).filter(([, value]) => value !== undefined)
    );

    await prisma.post.update({
      where: { id: postId as string },
      data: cleanData,
    });

    return res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const userId = req.user?.sub;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json(formatErrors('unauthorized', 'Unauthorized'));
    }

    const post: Post | null = await prisma.post.findUnique({ where: { id: postId as string } });

    if (!post) {
      return res.status(404).json(formatErrors('not_found', 'Post not found'));
    }

    if (post.writerId !== userId) {
      return res.status(403).json(formatErrors('forbidden', 'Not allowed to do this'));
    }

    await prisma.post.delete({ where: { id: postId as string } });

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unknown error ocurred' });
  }
}
