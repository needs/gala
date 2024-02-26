import { z } from "zod";
import { procedure } from "../trpc";
import { prisma } from '../../lib/prisma';

export default procedure
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
  })
