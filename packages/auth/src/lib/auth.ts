import admin from 'firebase-admin';
import { PrismaClient, User } from '@prisma/client';

export const isIdTokenValid = async (idToken: string) => {
  const user = await admin.auth().verifyIdToken(idToken).catch(() => {
    return undefined;
  })

  // If email is not yet verified, it's easy to impersonate someone else if an
  // account doesn't already exist.
  return user !== undefined && user.email_verified;
}

export const getUser = async (sessionCookie: string | undefined) => {
  if (sessionCookie === undefined) {
    return undefined;
  }

  const tokenData = await admin.auth().verifySessionCookie(sessionCookie, true).catch(() => {
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

const prisma = new PrismaClient();

export const getRole = async (uuid: string, user: User | undefined) => {
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
