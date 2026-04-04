import z from 'zod';

export const LoginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(['user', 'writer']),
});
