import * as trpc from '@trpc/server';
import { z } from 'zod';
import { middleware, procedure, router } from '../trpc';
import * as Y from 'yjs';
import { prisma } from '../../lib/prisma';

const isAuthed = middleware((opts) => {
  const { ctx } = opts;

  if (ctx.user === undefined) {
    throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      user: ctx.user
    },
  });
});

const authedProcedure = procedure.use(isAuthed);

export const appRouter = router({
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
