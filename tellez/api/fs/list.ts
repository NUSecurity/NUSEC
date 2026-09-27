/** A directory listing, filtered to what this session has earned. */

import { listDirectory } from "../../server/engine.ts";
import { requireMachine } from "../../server/guard.ts";
import { fail, param, type ApiRequest, type ApiResponse } from "../../server/http.ts";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const ctx = await requireMachine(req, res);
  if (!ctx) return;

  const path = param(req, "path");
  if (!path) return fail(res, 400, "missing_path");

  const outcome = await listDirectory(ctx, path, param(req, "hidden") === "1");

  if (outcome.status === "missing") return fail(res, 404, "not_found");
  if (outcome.status === "denied") return fail(res, 403, "access_denied");

  res.status(200).json({ ...outcome.listing, revealed: outcome.revealed });
}
