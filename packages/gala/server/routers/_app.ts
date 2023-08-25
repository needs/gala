import * as trpc from '@trpc/server';
import { z } from 'zod';
import { middleware, procedure, router } from '../trpc';
import * as Y from 'yjs';
import { prisma } from '../../lib/prisma';
import { auth } from 'firebase-admin';
import { isIdTokenValid } from '@gala/auth';

const isAuthed = middleware((opts) => {
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

      if (!(await isIdTokenValid(idToken))) {
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
          name: "",
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

  members: router({
    list: authedProcedure
      .input(z.object({ uuid: z.string().uuid() }))
      .output(z.array(z.object({ email: z.string(), name: z.string().optional(), role: z.enum(["OWNER", "EDITOR", "READER"]), joinedAt: z.date() })))
      .use(async (opts) => {
        const { uuid } = opts.input;

        const member = await prisma.galaUser.findUnique({
          where: {
            user_id_gala_uuid: {
              user_id: opts.ctx.user.id,
              gala_uuid: uuid,
            }
          },
        });

        if (member === null) {
          throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
        }

        return opts.next(opts);
      })
      .query(async (opts) => {
        const members = await prisma.galaUser.findMany({
          select: {
            user: {
              select: {
                email: true,
                name: true,
              }
            },
            role: true,
            created_at: true,
          },
          where: {
            gala_uuid: opts.input.uuid
          }
        });

        return members.map((member) => {
          return {
            email: member.user.email,
            role: member.role,
            joinedAt: member.created_at,
            name: member.user.name ?? undefined,
          }
        });
      }
      ),
  })
});

export type AppRouter = typeof appRouter;
