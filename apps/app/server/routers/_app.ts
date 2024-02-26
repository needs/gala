import * as trpc from '@trpc/server';
import { z } from 'zod';
import { middleware, procedure, router } from '../trpc';
import * as Y from 'yjs';
import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';
import { getUserName } from '../../lib/avatar';

const isAuthedMiddleware = middleware((opts) => {
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

const authedProcedure = procedure.use(isAuthedMiddleware);

const isMemberMiddleware = isAuthedMiddleware.unstable_pipe(async (opts) => {
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

const isOwnerMiddleware = isMemberMiddleware.unstable_pipe(async (opts) => {
  const {
    ctx: { member },
  } = opts;

  if (member.role !== 'OWNER') {
    throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next(opts);
});

export const appRouter = router({
  user: authedProcedure
    .input(z.null())
    .output(
      z.object({
        email: z.string(),
        name: z.string().optional(),
        createdAt: z.date(),
        isAdmin: z.boolean(),
      })
    )
    .query((opts) => {
      const { email, name, createdAt, isAdmin } = opts.ctx.user;
      return {
        email,
        name: name ?? undefined,
        createdAt,
        isAdmin,
      };
    }),

  userName: procedure
    .input(z.null())
    .output(
      z.string()
    )
    .query((opts) => {
      const user = opts.ctx.user;

      if (user === undefined) {
        return 'Anonymous';
      } else {
        return getUserName(user.email, user.name ?? undefined);
      }
    }),

  updateUser: authedProcedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .output(z.null())
    .mutation(async (opts) => {
      await prisma.user.update({
        where: {
          id: opts.ctx.user.id,
        },
        data: {
          name: opts.input.name || null,
        },
      });

      return null;
    }),

  list: authedProcedure
    .input(z.null())
    .output(
      z.array(
        z.object({
          uuid: z.string().uuid(),
          name: z.string(),
          teamCount: z.number(),
          cumulativeDuration: z.number(),
          playerCount: z.number(),
          viewCount: z.number(),
        })
      )
    )
    .query(async (opts) => {
      const competitions = await prisma.competition.findMany({
        select: {
          uuid: true,
          name: true,
          teamCount: true,
          cumulativeDuration: true,
          playerCount: true,
          viewCount: true,
        },
        where: {
          users: {
            some: {
              userId: opts.ctx.user.id,
            },
          },
          deletedAt: null,
        },
      });

      return competitions;
    }),

  listPublic: procedure
    .input(z.null())
    .output(
      z.array(
        z.object({
          uuid: z.string().uuid(),
          name: z.string(),
          teamCount: z.number(),
          cumulativeDuration: z.number(),
          playerCount: z.number(),
          viewCount: z.number(),
        })
      )
    )
    .query(async () => {
      const competitions = await prisma.competition.findMany({
        select: {
          uuid: true,
          name: true,
          teamCount: true,
          cumulativeDuration: true,
          playerCount: true,
          viewCount: true,
        },
        where: {
          deletedAt: null,
          isPublicShowcase: true,
        },
      });

      return competitions;
    }),

  create: authedProcedure
    .input(z.null())
    .output(z.object({ uuid: z.string().uuid() }))
    .mutation(async (opts) => {
      const data = Y.encodeStateAsUpdate(new Y.Doc());

      const competition = await prisma.competition.create({
        data: {
          data: Buffer.from(data),
          name: '',
          teamCount: 0,

          users: {
            create: {
              userId: opts.ctx.user.id,
              role: 'OWNER',
            },
          },
        },
      });

      return {
        uuid: competition.uuid,
      };
    }),

  delete: authedProcedure
    .input(z.object({ uuid: z.string().uuid() }))
    .output(z.null())
    .mutation(async (opts) => {
      await prisma.competition.update({
        where: {
          uuid: opts.input.uuid,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return null;
    }),

  toShortId: procedure
    .input(z.object({ uuid: z.string().uuid(), screenUuid: z.string().uuid() }))
    .output(z.string())
    .use(isMemberMiddleware)
    .mutation(async (opts) => {
      const shortId = nanoid(8);

      await prisma.screenShortId.create({
        data: {
          shortId: shortId,
          competitionUuid: opts.input.uuid,
          screenUuid: opts.input.screenUuid,
        },
      });

      return shortId;
    }),

  members: router({
    list: procedure
      .input(z.object({ uuid: z.string().uuid() }))
      .output(
        z.array(
          z.object({
            email: z.string(),
            name: z.string().optional(),
            role: z.enum(['OWNER', 'EDITOR', 'READER']),
            joinedAt: z.date(),
          })
        )
      )
      .use(isMemberMiddleware)
      .query(async (opts) => {
        const members = await prisma.competitionUser.findMany({
          select: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
            role: true,
            createdAt: true,
          },
          where: {
            competitionUuid: opts.input.uuid,
          },
        });

        return members.map((member) => {
          return {
            email: member.user.email,
            role: member.role,
            joinedAt: member.createdAt,
            name: member.user.name ?? undefined,
          };
        });
      }),

    add: procedure
      .input(
        z.object({
          uuid: z.string().uuid(),
          email: z.string(),
          role: z.enum(['OWNER', 'EDITOR', 'READER']),
        })
      )
      .output(z.null())
      .use(isOwnerMiddleware)
      .mutation(async (opts) => {
        const { uuid, email, role } = opts.input;

        const user = await prisma.user.upsert({
          where: {
            email: email,
          },
          update: {},
          create: {
            email: email,
          },
        });

        await prisma.competitionUser.create({
          data: {
            userId: user.id,
            competitionUuid: uuid,
            role: role,
          },
        });

        return null;
      }),

    remove: procedure
      .input(z.object({ uuid: z.string().uuid(), email: z.string() }))
      .output(z.null())
      .use(isOwnerMiddleware)
      .mutation(async (opts) => {
        const { uuid, email } = opts.input;

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            id: true,
          },
        });

        if (user !== null) {
          await prisma.competitionUser.deleteMany({
            where: {
              competitionUuid: uuid,
              userId: user.id,
            },
          });
        }

        return null;
      }),

    updateRole: procedure
      .input(
        z.object({
          uuid: z.string().uuid(),
          email: z.string(),
          role: z.enum(['OWNER', 'EDITOR', 'READER']),
        })
      )
      .output(z.null())
      .use(isOwnerMiddleware)
      .mutation(async (opts) => {
        const { uuid, email, role } = opts.input;

        await prisma.competitionUser.updateMany({
          where: {
            competitionUuid: uuid,
            user: {
              email: email,
            },
          },
          data: {
            role: role,
          },
        });

        return null;
      }),
  }),
});

export type AppRouter = typeof appRouter;
