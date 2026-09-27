/**
 * Liveness, and — more usefully — a way to wake the database.
 *
 * Neon's free tier suspends after a few minutes idle, so the first query after
 * a quiet spell pays a cold start. Hitting this before the room fills means
 * participant number one is not the person who wakes it. It is step 5 of the
 * run of show for that reason.
 */

import { preflight } from "../server/preflight.ts";
import { store, storageKind } from "../server/db.ts";
import { world } from "../server/engine.ts";
import type { ApiRequest, ApiResponse } from "../server/http.ts";

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  const started = Date.now();
  let database = "ok";

  try {
    await store().listSessions();
  } catch (error) {
    database = error instanceof Error ? error.message : "error";
  }

  const check = preflight(world());

  res.status(database === "ok" ? 200 : 503).json({
    ok: database === "ok",
    storage: storageKind(),
    database,
    warmedInMs: Date.now() - started,
    content: { ok: check.ok, problems: check.problems.length },
  });
}
