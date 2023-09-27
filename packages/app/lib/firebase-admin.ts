import { initializeAdminApp } from "@tgym.fr/auth";

const adminAppSingleton = () => {
  return initializeAdminApp();
};

type AdminAppSingleton = ReturnType<typeof adminAppSingleton>;

const globalForAdminApp = globalThis as unknown as {
  adminApp: AdminAppSingleton | undefined;
};

export const adminApp = globalForAdminApp.adminApp ?? adminAppSingleton();

globalForAdminApp.adminApp = adminApp;
