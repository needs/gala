import admin from 'firebase-admin';
import z from 'zod';

const firebaseConfigSchema = z.object({
  projectId: z.string(),
  privateKey: z.string().transform((value) => value.replace(/\\n/g, '\n')),
  clientEmail: z.string(),
});

function getFirebaseConfig() {
  const FIREBASE_CONFIG = process.env["FIREBASE_CONFIG"];

  if (FIREBASE_CONFIG !== undefined) {
    try {
      return firebaseConfigSchema.parse(JSON.parse(FIREBASE_CONFIG));
    } catch (e) {
      console.error(e);
      console.warn("Using regular env vars for Firebase config.");
    }
  }

  return firebaseConfigSchema.parse({
    projectId: process.env["FIREBASE_PROJECT_ID"],
    privateKey: process.env["FIREBASE_PRIVATE_KEY"],
    clientEmail: process.env["FIREBASE_CLIENT_EMAIL"],
  });
}

export const initializeAdminApp = () => {
  const firebaseConfig = getFirebaseConfig();

  return admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  }, "admin");
}
