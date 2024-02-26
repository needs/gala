import { z } from "zod";
import { authedProcedure } from "../utils";
import { prisma } from "../../lib/prisma";
import * as Y from 'yjs';

export default authedProcedure
  .input(z.null())
  .output(z.object({ uuid: z.string().uuid() }))
  .mutation(async (opts) => {
    const data = Y.encodeStateAsUpdate(new Y.Doc());

    const competition = await prisma.competition.create({
      data: {
        data: Buffer.from(data),
        name: '',
        teamCount: 0,

        users: {
          create: {
            userId: opts.ctx.user.id,
            role: 'OWNER',
          },
        },
      },
    });

    return {
      uuid: competition.uuid,
    };
  });
