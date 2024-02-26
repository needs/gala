import { z } from 'zod';

// Boxed values are a synced store concept that allows changing a full object at
// once.  Under the hood it's a simple object with a "value" field.  Add a
// custom zod schema to validate the value.
const boxedSchema = <T extends z.ZodType<any>>(schema: T) => z.object({
  value: schema,
});

export const genders = ['man', 'woman', 'mixed'] as const;
export const genderSchema = z.enum(genders);

export const allApparatusKeys = [
  'vault',
  'unevenBars',
  'beam',
  'floor',
  'highBar',
  'parallelBars',
  'rings',
  'pommelHorse',
  'rest',
] as const;
export const apparatusKeySchema = z.enum(allApparatusKeys);

export type Gender = z.infer<typeof genderSchema>;
export type ApparatusKey = z.infer<typeof apparatusKeySchema>;

export const playerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: genderSchema,
});

export type Player = z.infer<typeof playerSchema>;

export const teamSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  members: z.record(z.boolean()),
  categoryKey: z.string().optional(),
});

export type Team = z.infer<typeof teamSchema>;

export const categorySchema = z.object({
  name: z.string(),
  gender: genderSchema,
  apparatuses: z.record(z.object({
    name: z.string(),
    icon: z.string(),
  })),
});

export type Category = z.infer<typeof categorySchema>;

export const barItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  order: z.number(),
});

export type BarItem = z.infer<typeof barItemSchema>;

export const barCategorySchema = z.object({
  name: z.string(),
  items: z.record(barItemSchema),
  order: z.number(),
  icon: z.string().optional(),
});

export type BarCategory = z.infer<typeof barCategorySchema>;

export const baseScreenSchema = z.object({
  name: z.string(),
  shortUrlId: z.string().optional(),
});

export type BaseScreen = z.infer<typeof baseScreenSchema>;

export const screenBarSchema = z.object({
  type: z.literal('bar'),
  ...baseScreenSchema.shape,
});

export type ScreenBar = z.infer<typeof screenBarSchema>;

export const screenProgressSchema = z.object({
  type: z.literal('progress'),
  scheduleUuid: z.string().optional(),
  ...baseScreenSchema.shape,
});

export type ScreenProgress = z.infer<typeof screenProgressSchema>;

export const screenSchema = z.union([screenBarSchema, screenProgressSchema]);
export const screenTypes: Screen['type'][] = ['bar', 'progress'];

export type Screen = z.infer<typeof screenSchema>;

export const scheduleEventRotationApparatusSchema = z.object({
  type: apparatusKeySchema,
  teams: z.record(z.boolean()),
  order: z.number(),
});

export type ScheduleEventRotationApparatus = z.infer<typeof scheduleEventRotationApparatusSchema>;

export const scheduleEventRotationSchema = z.object({
  type: z.literal('rotation'),
  durationInMinutes: z.number(),
  order: z.number(),
  apparatuses: z.record(scheduleEventRotationApparatusSchema).default({}),
});

export type ScheduleEventRotation = z.infer<typeof scheduleEventRotationSchema>;

export const scheduleEventPauseSchema = z.object({
  type: z.literal('pause'),
  durationInMinutes: z.number(),
  order: z.number(),
});

export type ScheduleEventPause = z.infer<typeof scheduleEventPauseSchema>;

export const scheduleEventSchema = z.union([scheduleEventRotationSchema, scheduleEventPauseSchema]);

export type ScheduleEvent = z.infer<typeof scheduleEventSchema>;

export const scheduleSchema = z.object({
  name: z.string(),
  startDate: z.string(),
  events: z.record(scheduleEventSchema).default({}),
  progress: z.number().optional(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

export const competitionSchema = z.object({
  players: z.record(playerSchema).default({}),
  teams: z.record(teamSchema).default({}),
  categories: z.record(categorySchema).default({}),
  schedules: z.record(scheduleSchema).default({}),
  bar: z.record(barCategorySchema).default({}),
  screens: z.record(screenSchema).default({}),
  info: z.object({
    name: z.string(),
  }).partial().default({}),
});

export type Competition = z.infer<typeof competitionSchema>;
