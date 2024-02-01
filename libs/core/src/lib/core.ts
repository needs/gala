import { z } from 'zod';

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
  players: z.record(playerSchema),
  teams: z.record(teamSchema),
  categories: z.record(categorySchema),
  stages: z.record(stageSchema),
  progresses: z.record(progressSchema),
  bar: z.record(barCategorySchema),
  screens: z.record(screenSchema),
  info: z.object({
    name: z.string(),
  }),
});

export type Competition = z.infer<typeof competitionSchema>;
