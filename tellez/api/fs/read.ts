/** One file's contents, if this session may have it. */

import { openNode } from "../../server/engine.ts";
import { requireMachine } from "../../server/guard.ts";
import { fail, param, type ApiRequest, type ApiResponse } from "../../server/http.ts";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const ctx = await requireMachine(req, res);
  if (!ctx) return;

  const path = param(req, "path");
  if (!path) return fail(res, 400, "missing_path");

  const outcome = await openNode(ctx, path);

  if (outcome.status === "missing") return fail(res, 404, "not_found");
  if (outcome.status === "is_directory") return fail(res, 400, "is_directory");
  if (outcome.status === "denied") return fail(res, 403, "access_denied");

  res.status(200).json({
    summary: outcome.summary,
    content: outcome.content,
    opensWith: outcome.opensWith,
    revealed: outcome.revealed,
  });
}
