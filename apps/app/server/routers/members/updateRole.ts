import { z } from "zod";
import { procedure } from "../../trpc";
import { isOwnerMiddleware } from "../../utils";
import { prisma } from "../../../lib/prisma";

export default procedure
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
  })
