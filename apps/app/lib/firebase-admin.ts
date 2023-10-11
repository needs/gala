import { initializeAdminApp } from '@tgym.fr/auth';

const globalForFirebaseAdmin = globalThis as unknown as {
  app: ReturnType<typeof initializeAdminApp> | undefined;
};

export const getFirebaseAdminApp = () => {
  if (globalForFirebaseAdmin.app === undefined) {
    globalForFirebaseAdmin.app = initializeAdminApp();
  }

  return globalForFirebaseAdmin.app;
};
