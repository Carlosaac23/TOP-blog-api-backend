import z from 'zod';

export const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const PostSchema = CreatePostSchema.extend({
  id: z.cuid2(),
  writerId: z.cuid2(),
});

export type Post = z.infer<typeof PostSchema>;
