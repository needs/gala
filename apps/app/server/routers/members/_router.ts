import { router } from "../../trpc";
import add from "./add";
import list from "./list";
import remove from "./remove";
import updateRole from "./updateRole";

export default router({
  list: list,
  add: add,
  remove: remove,
  updateRole: updateRole
});
