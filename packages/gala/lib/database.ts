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
  z.string(),
  z.object({
    name: z.string(),
    members: z.record(
      z.string(),
      z.oboolean(),
    ).optional().default({}),
    category: z.string().optional(),
  }),
).default({});

export type Teams = z.infer<typeof teamsSchema>;
export type Team = Teams[string];

export const genderSchema = z.enum(["man", "woman", "mixed"])
export type Gender = z.infer<typeof genderSchema>;

export const playersSchema = z.record(
  z.string(),
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    gender: genderSchema.optional().default("man"),
  })
).default({});

export type Player = z.infer<typeof playersSchema>[string];

export const categoriesSchema = z.record(
  z.string(),
  z.object({
    name: z.string(),
    gender: genderSchema.optional().default("man"),
    apparatuses: z.record(
      z.string(),
      z.object({
        name: z.string(),
        icon: z.string(),
      }),
    ).optional().default({}),
  })
).default({});

export type Category = z.infer<typeof categoriesSchema>[string];
export type Apparatus = Category["apparatuses"][string];

export const judgesSchema = z.record(
  z.string(),
  z.object({
    firstName: z.string(),
    lastName: z.string(),
  })
).default({});

export type Judge = z.infer<typeof judgesSchema>[string];
