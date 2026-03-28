import z from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().trim().min(5).max(120),
  content: z.string().trim().min(20).max(10000),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const PostSchema = CreatePostSchema.extend({
  id: z.cuid2(),
  writerId: z.cuid2(),
});

export type Post = z.infer<typeof PostSchema>;
