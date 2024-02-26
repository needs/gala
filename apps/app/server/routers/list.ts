import { z } from "zod";
import { authedProcedure } from "../utils";
import { prisma } from "../../lib/prisma";

export default authedProcedure
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
  })
