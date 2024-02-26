import { router } from '../trpc';
import user from './user';
import userName from './userName';
import updateUser from './updateUser';
import list from './list';
import listPublic from './listPublic';
import create from './create';
import delete_ from './delete';
import toShortId from './toShortId';
import membersRouter from './members/_router';

export const appRouter = router({
  user: user,
  userName: userName,
  updateUser: updateUser,
  list: list,
  listPublic: listPublic,
  create: create,
  delete: delete_,
  toShortId: toShortId,

  members: membersRouter,
});

export type AppRouter = typeof appRouter;
