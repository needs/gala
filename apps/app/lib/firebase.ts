import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { z } from 'zod';

const globalForFirebase = globalThis as unknown as {
  app: FirebaseApp | undefined;
  auth: Auth | undefined;
};

const firebaseConfigSchema = z.object({
  apiKey: z.string(),
  authDomain: z.string(),
  projectId: z.string(),
  storageBucket: z.string(),
  messagingSenderId: z.string(),
  appId: z.string(),
  measurementId: z.string(),
});

function getFirebaseConfig() {
  const FIREBASE_CONFIG = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

  console.log('Firebase public config found', FIREBASE_CONFIG);

  if (FIREBASE_CONFIG === undefined) {
    throw new Error('Missing Firebase config.');
  }

  return firebaseConfigSchema.parse(JSON.parse(FIREBASE_CONFIG));
}

export const getFirebaseApp = () => {
  if (globalForFirebase.app === undefined) {
    const firebaseConfig = getFirebaseConfig();

    const app = initializeApp(firebaseConfig);
    globalForFirebase.app = app;
  }

  return globalForFirebase.app;
};

export const getFirebaseAppAuth = () => {
  if (globalForFirebase.auth === undefined) {
    const app = getFirebaseApp();
    globalForFirebase.auth = getAuth(app);
  }

  return globalForFirebase.auth;
};
