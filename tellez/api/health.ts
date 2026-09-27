/**
 * Liveness, configuration check, and — most usefully — a way to wake the
 * database.
 *
 * Neon's free tier suspends after a few minutes idle, so the first query after
 * a quiet spell pays a cold start. Hitting this before the room fills means
 * participant number one is not the person who wakes it.
 *
 * It also answers the question you actually want answered ten minutes before a
 * meeting: *is this deploy configured properly?* Every misconfiguration here is
 * otherwise silent until somebody hits it — an unset SESSION_SECRET 500s the
 * join page, an unset DATABASE_URL fragments progress across instances, and an
 * unset FACILITATOR_PASSWORD means the board will not open.
 *
 * Booleans only. It never reports a configured value.
 */

import { store, storageKind } from "../server/db.js";
import { world } from "../server/engine.js";
import type { ApiRequest, ApiResponse } from "../server/http.js";
import { preflight } from "../server/preflight.js";

const isSet = (name: string) => (process.env[name]?.trim().length ?? 0) > 0;

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  const started = Date.now();
  const production = process.env.NODE_ENV === "production";

  let database = "ok";
  try {
    await store().listSessions();
  } catch (error) {
    database = error instanceof Error ? error.message : "error";
  }

  const config = {
    DATABASE_URL: isSet("DATABASE_URL"),
    SESSION_SECRET: isSet("SESSION_SECRET"),
    FACILITATOR_PASSWORD: isSet("FACILITATOR_PASSWORD"),
  };

  // In production all three are required. Locally every one of them has a
  // working fallback, which is the whole point of the dev setup.
  const problems: string[] = [];
  if (database !== "ok") problems.push(`database: ${database}`);

  if (production) {
    if (!config.DATABASE_URL) {
      problems.push(
        "DATABASE_URL is unset — the file store does not work across serverless " +
          "instances, so progress will fragment",
      );
    }
    if (!config.SESSION_SECRET) problems.push("SESSION_SECRET is unset — sessions cannot be issued");
    if (!config.FACILITATOR_PASSWORD) problems.push("FACILITATOR_PASSWORD is unset — /board is closed");
  }

  const content = preflight(world(), false);
  for (const problem of content.problems) problems.push(`content: ${problem}`);

  res.status(problems.length === 0 ? 200 : 503).json({
    ok: problems.length === 0,
    environment: production ? "production" : "development",
    storage: storageKind(),
    config,
    warmedInMs: Date.now() - started,
    problems,
  });
}
