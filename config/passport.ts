import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStragety,
  type StrategyOptionsWithoutRequest,
  type VerifiedCallback,
} from 'passport-jwt';

import type { AuthJwtPayload } from '../types/index.js';

import { prisma } from '../lib/prisma.js';

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStragety(opts, async (jwtPayload: AuthJwtPayload, done: VerifiedCallback) => {
    try {
      const { sub, role } = jwtPayload;

      if (!sub || !role) {
        return done(null, false);
      }

      let account = null;

      if (role === 'user') {
        account = await prisma.user.findUnique({ where: { id: sub } });
      } else if (role === 'writer') {
        account = await prisma.writer.findUnique({ where: { id: sub } });
      }

      if (!account) {
        return done(null, false);
      }

      return done(null, account);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
