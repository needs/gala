import { z } from "zod";
import { authedProcedure } from "../utils";
import { prisma } from "../../lib/prisma";

export default authedProcedure
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
  });
