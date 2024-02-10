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

export const progressSchema = z.record(z.string());

export type Progress = z.infer<typeof progressSchema>;

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

export const timelineRotationApparatusSchema = z.object({
  teams: z.record(z.boolean()),
});

export type TimelineRotationApparatus = z.infer<typeof timelineRotationApparatusSchema>;

export const timelineRotationSchema = z.object({
  type: z.literal('rotation'),
  order: z.number(),
  apparatuses: z.record(timelineRotationApparatusSchema),
  durationInMinutes: z.number(),
});

export type TimelineRotation = z.infer<typeof timelineRotationSchema>;

export const timelinePauseSchema = z.object({
  type: z.literal('pause'),
  order: z.number(),
  durationInMinutes: z.number(),
});

export type TimelinePause = z.infer<typeof timelinePauseSchema>;

export const timelineSchema = z.union([timelineRotationSchema, timelinePauseSchema]);

export type Timeline = z.infer<typeof timelineSchema>;

export const stageSchema = z.object({
  name: z.string(),
  timeline: z.record(timelineSchema),
  timelineStartDate: z.string(),
  progress: z.number().optional(),
  apparatuses: z.record(z.number()),
});

export type Stage = z.infer<typeof stageSchema>;

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
  stageKey: z.string(),
  ...baseScreenSchema.shape,
});

export type ScreenProgress = z.infer<typeof screenProgressSchema>;

export const screenSchema = z.union([screenBarSchema, screenProgressSchema]);
export const screenTypes: Screen['type'][] = ['bar', 'progress'];

export type Screen = z.infer<typeof screenSchema>;

export const competitionSchema = z.object({
  players: z.record(playerSchema).default({}),
  teams: z.record(teamSchema).default({}),
  categories: z.record(categorySchema).default({}),
  stages: z.record(stageSchema).default({}),
  progresses: z.record(progressSchema).default({}),
  bar: z.record(barCategorySchema).default({}),
  screens: z.record(screenSchema).default({}),
  info: z.object({
    name: z.string(),
  }).default({ name: '' }),
});

export type Competition = z.infer<typeof competitionSchema>;
