import { z } from "zod";
import { procedure } from "../trpc";
import { isMemberMiddleware } from "../utils";
import { nanoid } from "nanoid";
import { prisma } from "../../lib/prisma";

export default procedure
  .input(z.object({ uuid: z.string().uuid(), screenUuid: z.string().uuid() }))
  .output(z.string())
  .use(isMemberMiddleware)
  .mutation(async (opts) => {
    const shortId = nanoid(8);

    await prisma.screenShortId.create({
      data: {
        shortId: shortId,
        competitionUuid: opts.input.uuid,
        screenUuid: opts.input.screenUuid,
      },
    });

    return shortId;
  });
