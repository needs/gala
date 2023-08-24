import admin from 'firebase-admin';
import { PrismaClient, User } from '@prisma/client';

const getTokenData = async ({ idToken, sessionCookie }: { idToken?: string, sessionCookie?: string }) => {
  if (idToken !== undefined) {
    return await admin.auth().verifyIdToken(idToken).catch(() => {
      return undefined;
    })
  }

  if (sessionCookie !== undefined) {
    return await admin.auth().verifySessionCookie(sessionCookie, true).catch(() => {
      return undefined;
    })
  }

  return undefined;
}

export const getUser = async ({ idToken, sessionCookie }: { idToken?: string, sessionCookie?: string }) => {
  const tokenData = await getTokenData({ idToken, sessionCookie });

  if (tokenData === undefined) {
    return undefined;
  }

  const email = tokenData.email
  const emailVerified = tokenData.email_verified

  if (emailVerified === undefined || emailVerified === false || email === undefined) {
    return undefined;
  }

  return await prisma.user.upsert({
    where: {
      email: email
    },
    update: {},
    create: {
      email: email,
    }
  });
}

const prisma = new PrismaClient();

export const getRole = async (uuid: string, user: User | undefined) => {
  if (user === undefined) {
    return undefined;
  }

  if (user.is_admin === true) {
    return "OWNER";
  }

  const galaUser = await prisma.galaUser.findFirst({
    where: {
      user_id: user.id,
      gala_uuid: uuid
    },
    select: {
      role: true
    }
  });

  return galaUser?.role;
}
