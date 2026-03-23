type AuthRole = 'user' | 'writer';

export interface AuthJwtPayload {
  sub: string;
  role: AuthRole;
  iat?: number;
  exp?: number;
}

export type AuthUser = { id: string; role: 'user' | 'writer' };
