import * as trpc from '@trpc/server';
import { z } from 'zod';
import { middleware, procedure, router } from '../trpc';
import * as Y from 'yjs';
import { prisma } from '../../lib/prisma';
import { auth } from 'firebase-admin';
import { isIdTokenValid } from '@tgym.fr/auth';
import { nanoid } from 'nanoid';
import { adminApp } from '../../lib/firebase-admin';

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
      user_id_competition_uuid: {
        user_id: user.id,
        competition_uuid: uuid,
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
  login: procedure
    .input(z.object({ idToken: z.string() }))
    .output(z.object({ sessionCookie: z.string(), expiresIn: z.number() }))
    .mutation(async (opts) => {
      const { idToken } = opts.input;

      // TODO: Double check that this flow is not subject to CSRF attacks.

      // Set session expiration to 10 days.
      const expiresIn = 60 * 60 * 24 * 10 * 1000;

      if (!(await isIdTokenValid(adminApp, idToken))) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });

      return {
        sessionCookie,
        expiresIn,
      };
    }),

  user: authedProcedure
    .input(z.null())
    .output(
      z.object({
        email: z.string(),
        name: z.string().optional(),
        created_at: z.date(),
        is_admin: z.boolean(),
      })
    )
    .query((opts) => {
      const { email, name, created_at, is_admin } = opts.ctx.user;
      return {
        email,
        name: name ?? undefined,
        created_at,
        is_admin,
      };
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
        })
      )
    )
    .query(async (opts) => {
      const competitions = await prisma.competition.findMany({
        select: {
          uuid: true,
          name: true,
          teamCount: true,
        },
        where: {
          users: {
            some: {
              user_id: opts.ctx.user.id,
            },
          },
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
              user_id: opts.ctx.user.id,
              role: 'OWNER',
            },
          },
        },
      });

      return {
        uuid: competition.uuid,
      };
    }),

  toShortId: procedure
    .input(z.object({ uuid: z.string().uuid(), screenUuid: z.string().uuid() }))
    .output(z.string())
    .use(isMemberMiddleware)
    .mutation(async (opts) => {
      const shortId = nanoid(8);

      await prisma.screenShortId.create({
        data: {
          short_id: shortId,
          competition_uuid: opts.input.uuid,
          screen_uuid: opts.input.screenUuid,
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
            created_at: true,
          },
          where: {
            competition_uuid: opts.input.uuid,
          },
        });

        return members.map((member) => {
          return {
            email: member.user.email,
            role: member.role,
            joinedAt: member.created_at,
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
            user_id: user.id,
            competition_uuid: uuid,
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
              competition_uuid: uuid,
              user_id: user.id,
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
            competition_uuid: uuid,
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
