import { z } from "zod";
import { procedure } from "../trpc";
import { prisma } from "../../lib/prisma";

export default procedure
  .input(z.object({
    competitionUuid: z.string().uuid().optional(),
  }))
  .output(
    z.object({
      email: z.string().optional(),
      name: z.string().nullable(),
      createdAt: z.date(),
      isAdmin: z.boolean(),
      isAuthenticated: z.boolean(),
      role: z.enum(['OWNER', 'EDITOR', 'READER']),
    })
  )
  .query(async (opts) => {
    if (opts.ctx.user === undefined) {
      return {
        email: undefined,
        name: 'Anonymous',
        createdAt: new Date(),
        isAdmin: false,
        isAuthenticated: false,
        role: 'READER',
      };
    } else {
      const competitionUuid = opts.input.competitionUuid;

      const member = competitionUuid === undefined ? null : await prisma.competitionUser.findUnique({
        select: {
          role: true,
        },

        where: {
          userId_competitionUuid: {
            userId: opts.ctx.user.id,
            competitionUuid,
          },
        },
      });

      const role = member === null ? 'READER' : member.role;

      return { ...opts.ctx.user, isAuthenticated: true, role };
    }
  })
