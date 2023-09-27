import admin from 'firebase-admin';
import { PrismaClient, User } from '@prisma/client';

export const isIdTokenValid = async (adminApp: admin.app.App, idToken: string) => {
  const user = await adminApp.auth().verifyIdToken(idToken).catch(() => {
    return undefined;
  })

  // If email is not yet verified, it's easy to impersonate someone else if an
  // account doesn't already exist.
  return user !== undefined && user.email_verified;
}

export const getUser = async (adminApp: admin.app.App, prisma: PrismaClient, sessionCookie: string | undefined) => {
  if (sessionCookie === undefined) {
    return undefined;
  }

  const tokenData = await adminApp.auth().verifySessionCookie(sessionCookie, true).catch(() => {
    return undefined;
  })

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

export const getRole = async (prisma: PrismaClient, uuid: string, user: User | undefined) => {
  if (user === undefined) {
    return undefined;
  }

  if (user.is_admin === true) {
    return "OWNER";
  }

  const competitionUser = await prisma.competitionUser.findFirst({
    where: {
      user_id: user.id,
      competition_uuid: uuid
    },
    select: {
      role: true
    }
  });

  return competitionUser?.role;
}
