import * as trpc from '@trpc/server';
import { z } from 'zod';
import { middleware, procedure, router } from '../trpc';
import * as Y from 'yjs';
import { prisma } from '../../lib/prisma';
import { auth } from 'firebase-admin';
import { getUser } from '@gala/auth';

const isAuthed = middleware((opts) => {
  const { ctx } = opts;

  if (ctx.user === undefined) {
    throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      user: ctx.user,
      crsfToken: ctx.crsfToken
    },
  });
});

const authedProcedure = procedure.use(isAuthed);

export const appRouter = router({
  login: procedure
    .input(z.object({ idToken: z.string() }))
    .output(z.object({ sessionCookie: z.string(), expiresIn: z.number() }))
    .mutation(async (opts) => {
      const { idToken } = opts.input

      // TODO: Double check that this flow is not subject to CSRF attacks.

      // Set session expiration to 10 days.
      const expiresIn = 60 * 60 * 24 * 10 * 1000;

      const user = getUser({ idToken });

      if (user === undefined) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

      const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

      return {
        sessionCookie,
        expiresIn
      }
    }),

  list: authedProcedure
    .input(z.null())
    .output(z.array(z.object({ uuid: z.string().uuid(), teamCount: z.number() })))
    .query(async (opts) => {
      const galas = await prisma.gala.findMany({
        select: {
          uuid: true,
          teamCount: true,
        },
        where: {
          users: {
            some: {
              user_id: opts.ctx.user.id
            }
          }
        }
      });

      return galas;
    }),

  create: authedProcedure
    .input(z.null())
    .output(z.object({ uuid: z.string().uuid() }))
    .mutation(async (opts) => {
      const data = Y.encodeStateAsUpdate(new Y.Doc());

      const gala = await prisma.gala.create({
        data: {
          data: Buffer.from(data),
          teamCount: 0,

          users: {
            create: {
              user_id: opts.ctx.user.id,
              role: 'OWNER',
            }
          }
        },
      });

      return {
        uuid: gala.uuid,
      };
    }),
});

export type AppRouter = typeof appRouter;
