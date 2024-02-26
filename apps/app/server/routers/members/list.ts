import { z } from "zod";
import { procedure } from "../../trpc";
import { isMemberMiddleware } from "../../utils";
import { prisma } from "../../../lib/prisma";

export default procedure
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
  });
