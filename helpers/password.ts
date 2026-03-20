import bcrypt from 'bcrypt';

export async function generateHashedPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function validateHashedPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
