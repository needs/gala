import { z } from 'zod';
import { procedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import * as Y from 'yjs';

const prisma = new PrismaClient();

export const appRouter = router({
  list: procedure
    .input(z.null())
    .output(z.array(z.object({ uuid: z.string().uuid(), teamCount: z.number() })))
    .query(async () => {
      const galas = await prisma.gala.findMany({
        select: {
          uuid: true,
          data: true
        },
      });

      const ret = galas.map(gala => {
        const doc = new Y.Doc()

        try {
          Y.applyUpdate(doc, Uint8Array.from(gala.data));
        } catch (e) {
          console.error(e)
        }

        return {
          uuid: gala.uuid,
          teamCount: doc.getMap('teams').size,
        }
      })

      return ret;
    }),
  create: procedure
    .input(z.null())
    .output(z.object({ uuid: z.string().uuid() }))
    .mutation(async () => {
      const data = Y.encodeStateAsUpdate(new Y.Doc());

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
