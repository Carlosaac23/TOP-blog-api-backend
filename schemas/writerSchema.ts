import z from 'zod';

export const CreateWriterSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  lastName: z.string().nullable(),
  username: z.string().min(6, 'Username must be at least 6 characters long'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at leats 8 characters long'),
  role: z.string(),
  birthDate: z.coerce.date(),
});

export const UpdateWriterSchema = CreateWriterSchema.partial().omit({ role: true });

export const WriterSchema = CreateWriterSchema.extend({
  id: z.cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Writer = z.infer<typeof WriterSchema>;
