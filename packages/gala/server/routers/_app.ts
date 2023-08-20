import { z } from 'zod';
import { procedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import * as Y from 'yjs';

const prisma = new PrismaClient();

export const appRouter = router({
  create: procedure
    .input(z.null())
    .output(z.object({ uuid: z.string().uuid() }))
    .mutation(async () => {
      const data = Y.encodeStateAsUpdateV2(new Y.Doc());

      const gala = await prisma.gala.create({
        data: {
          data: Buffer.from(data),
        },
      });

      return {
        uuid: gala.uuid,
      };
    }),
});

export type AppRouter = typeof appRouter;
