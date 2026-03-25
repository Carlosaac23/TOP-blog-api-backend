import type { Response, Request } from 'express';

export function home(_req: Request, res: Response) {
  res.json({ message: 'Hola jejeje :D' });
}
