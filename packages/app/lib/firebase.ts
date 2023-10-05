import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const globalForFirebase = globalThis as unknown as {
  app: FirebaseApp | undefined;
  auth: Auth | undefined;
};

export const getFirebaseApp = () => {
  if (globalForFirebase.app === undefined) {
    const firebaseConfig = {
      apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"],
      authDomain: process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
      projectId: process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
      storageBucket: process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
      messagingSenderId: process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
      appId: process.env["NEXT_PUBLIC_FIREBASE_APP_ID"],
      measurementId: process.env["NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"],
    };

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
