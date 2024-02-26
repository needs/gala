import { z } from "zod";
import { authedProcedure } from "../utils";
import { prisma } from "../../lib/prisma";

export default authedProcedure
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
  })
