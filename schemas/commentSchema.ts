import z, { cuid2 } from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string().min(1),
});

const CommentSchema = CreateCommentSchema.extend({
  id: cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.cuid2(),
  postId: z.cuid2(),
});

export type Comment = z.infer<typeof CommentSchema>;
