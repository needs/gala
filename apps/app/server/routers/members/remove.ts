import { z } from "zod";
import { procedure } from "../../trpc";
import { isOwnerMiddleware } from "../../utils";
import { prisma } from "../../../lib/prisma";

export default procedure
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
          competitionUuid: uuid,
          userId: user.id,
        },
      });
    }

    return null;
  })
