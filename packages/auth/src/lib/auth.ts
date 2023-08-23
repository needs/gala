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
  const user = await prisma.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true,
      is_admin: true
    }
  });

  if (user === null) {
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
