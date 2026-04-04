export type AuthRole = 'user' | 'writer';

export interface AuthJwtPayload {
  sub: string;
  role: AuthRole;
  iat?: number;
  exp?: number;
}

export type AuthSubject = {
  sub: string;
  role: AuthRole;
};

declare global {
  namespace Express {
    interface User extends AuthJwtPayload {}
  }
}
