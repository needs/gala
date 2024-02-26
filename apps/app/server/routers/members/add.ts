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
  })
