
import { z } from "zod";
import { procedure } from "../trpc";
import { getUserName } from "../../lib/avatar";

export default procedure
  .input(z.null())
  .output(
    z.string()
  )
  .query((opts) => {
    const user = opts.ctx.user;

    if (user === undefined) {
      return 'Anonymous';
    } else {
      return getUserName(user.email, user.name ?? undefined);
    }
  })
