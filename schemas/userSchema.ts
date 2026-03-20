import z from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  lastName: z.string().nullable(),
  username: z.string().min(6, 'Username must be at least 6 characters long'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at leats 8 characters long'),
  birthDate: z.coerce.date(),
});

export const UserSchema = CreateUserSchema.extend({
  id: z.cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
