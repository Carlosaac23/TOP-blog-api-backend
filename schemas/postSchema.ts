import z from 'zod';

export const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  writerId: z.cuid2(),
});

export const PostSchema = CreatePostSchema.extend({
  id: z.cuid2(),
});

export type Post = z.infer<typeof PostSchema>;
