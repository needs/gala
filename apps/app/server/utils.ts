import * as trpc from '@trpc/server';
import { z } from 'zod';
import { middleware, procedure } from './trpc';
import { prisma } from '../lib/prisma';

export const isAuthedMiddleware = middleware((opts) => {
  const { ctx } = opts;

  if (ctx.user === undefined) {
    throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const authedProcedure = procedure.use(isAuthedMiddleware);

export const isMemberMiddleware = isAuthedMiddleware.unstable_pipe(async (opts) => {
  const {
    ctx: { user },
    input,
  } = opts;

  const { uuid } = z.object({ uuid: z.string().uuid() }).parse(input);

  const member = await prisma.competitionUser.findUnique({
    where: {
      userId_competitionUuid: {
        userId: user.id,
        competitionUuid: uuid,
      },
    },
  });

  if (member === null) {
    throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      member,
    },
  });
});

export const isOwnerMiddleware = isMemberMiddleware.unstable_pipe(async (opts) => {
  const {
    ctx: { member },
  } = opts;

  if (member.role !== 'OWNER') {
    throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next(opts);
});
