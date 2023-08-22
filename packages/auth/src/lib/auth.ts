import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

export const getUserEmail = async (token: string | undefined) => {
  if (token === undefined) {
    return undefined;
  }

  const tokenData = await admin.auth().verifyIdToken(token).catch(() => {
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

  return email;
}

const prisma = new PrismaClient();

export const getRole = async (uuid: string, email: string | undefined) => {
  const galaUser = await prisma.galaUser.findFirst({
    where: {
      user: {
        email: email
      },
      gala: {
        uuid: uuid
      }
    },
    select: {
      role: true
    }
  });

  return galaUser?.role;
}
