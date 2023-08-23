import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getUser } from '@gala/auth';

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  const token = req.headers.authorization

  if (typeof token !== "string") {
    return {
      user: undefined,
    }
  }

  const user = await getUser(token);

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
