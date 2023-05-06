import { initializeApp } from 'firebase/app';
import { DatabaseReference, getDatabase, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const firebaseConfig = {
  databaseURL:
    'https://gala-8700f-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export function useDatabaseValue<T extends z.ZodTypeAny>(ref: DatabaseReference, schema: T): z.infer<T> | undefined {
  const [value, setValue] = useState<z.infer<T> | undefined>(
    undefined
  );

  useEffect(() => {
    onValue(ref, (snapshot) => {
      const val = snapshot.val();
      if (val === null) {
        setValue(schema.parse(undefined));
      } else {
        setValue(schema.parse(val));
      }
    });
  }, [setValue, ref, schema]);

  return value;
}

// It is recommended to flatten the data tree when using firebase realtime
// database.

export const teamsSchema = z.record(
  z.string().uuid(),
  z.object({
    name: z.string(),
    members: z.array(
      z.string().uuid()
    ),
  })
).default({});

export const playersSchema = z.record(
  z.string().uuid(),
  z.object({
    firstName: z.string(),
    lastName: z.string(),
  })
).default({});
