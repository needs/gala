import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getUser } from '@tgym.fr/auth';

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  const sessionCookie = req.cookies['session'];
  const user = await getUser(sessionCookie);

  return {
    user,
    sessionCookie,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
