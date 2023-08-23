import admin from 'firebase-admin';
import { PrismaClient, User } from '@prisma/client';

export const getUser = async (token: string | undefined) => {
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
