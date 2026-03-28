import z from 'zod';

export const CreateWriterSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().max(50).optional(),
  username: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.email(),
  password: z.string().min(12).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  bio: z.string().trim().min(1).max(150),
  birthDate: z.string().refine(date => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }),
  role: z.enum(['user', 'writer']),
});

export const UpdateWriterSchema = CreateWriterSchema.partial().omit({ role: true });

export const WriterSchema = CreateWriterSchema.extend({
  id: z.cuid2(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Writer = z.infer<typeof WriterSchema>;
