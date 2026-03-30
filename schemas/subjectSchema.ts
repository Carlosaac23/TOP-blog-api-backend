import z from 'zod';

export const CreateSubjectSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().max(50).nullable().optional(),
  username: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.email(),
  password: z.string().min(12).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  bio: z.string().trim().min(1).max(150),
  birthDate: z.coerce.date(),
  role: z.enum(['user', 'writer']),
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial().omit({ role: true });

export const SubjectSchema = z.object({
  id: z.cuid2(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  username: z.string(),
  email: z.email(),
  password: z.string(),
  bio: z.string(),
  role: z.string(),
  birthDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subject = z.infer<typeof SubjectSchema>;
