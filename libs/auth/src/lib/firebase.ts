import admin from 'firebase-admin';
import z from 'zod';

const firebaseConfigSchema = z.object({
  projectId: z.string(),
  privateKey: z.string().transform((value) => value.replace(/\\n/g, '\n')),
  clientEmail: z.string(),
});

function getFirebaseConfig() {
  const FIREBASE_CONFIG = process.env['FIREBASE_CONFIG'];

  if (FIREBASE_CONFIG === undefined) {
    throw new Error('Missing Firebase config.');
  }

  return firebaseConfigSchema.parse(JSON.parse(FIREBASE_CONFIG));
}

export const initializeAdminApp = () => {
  const firebaseConfig = getFirebaseConfig();

  return admin.initializeApp(
    {
      credential: admin.credential.cert(firebaseConfig),
    },
    'admin'
  );
};
