import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../lib/prisma';
import { getFirebaseAdminApp } from '../lib/firebase-admin';
import { getUser } from '@tgym.fr/auth';

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  const idToken = req.headers.authorization;
  const adminApp = getFirebaseAdminApp();

  return {
    user: await getUser(adminApp, prisma, idToken),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
