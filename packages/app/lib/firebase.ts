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
  const FIREBASE_CONFIG = process.env["NEXT_PUBLIC_FIREBASE_CONFIG"];

  console.log("Firebase public config found", FIREBASE_CONFIG)

  if (FIREBASE_CONFIG !== undefined) {
    try {
      return firebaseConfigSchema.parse(JSON.parse(FIREBASE_CONFIG));
    } catch (e) {
      console.error(e);
      console.warn("Using regular env vars for Firebase config.");
    }
  }

  return firebaseConfigSchema.parse({
    apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"],
    authDomain: process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
    projectId: process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
    storageBucket: process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
    messagingSenderId: process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
    appId: process.env["NEXT_PUBLIC_FIREBASE_APP_ID"],
    measurementId: process.env["NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"],
  });
}

export const getFirebaseApp = () => {
  if (globalForFirebase.app === undefined) {
    const firebaseConfig = getFirebaseConfig();

    const app = initializeApp(firebaseConfig);
    globalForFirebase.app = app;
  }

  return globalForFirebase.app;
}

export const getFirebaseAppAuth = () => {
  if (globalForFirebase.auth === undefined) {
    const app = getFirebaseApp();
    globalForFirebase.auth = getAuth(app);
  }

  return globalForFirebase.auth;
}
