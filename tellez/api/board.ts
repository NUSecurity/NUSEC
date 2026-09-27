/**
 * The facilitator board.
 *
 * Unlisted, password-gated, and never linked from the participant UI. Polled
 * every couple of seconds from the projector — polling rather than push because
 * one dashboard hitting one endpoint for ninety minutes is a few thousand
 * requests, and a websocket would buy nothing for that.
 *
 * The number that matters most is not who has finished. It is the per-objective
 * count, because that is what tells you the whole room is stuck on one thing.
 */

import type { BoardObjective, BoardSession, BoardView, StoredEvent } from "../shared/protocol.js";
import { store, storageKind } from "../server/db.js";
import { world } from "../server/engine.js";
import { fail, header, param, type ApiRequest, type ApiResponse } from "../server/http.js";
import { deriveProgress } from "../server/objectives.js";
import { preflight } from "../server/preflight.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const expected = process.env.FACILITATOR_PASSWORD?.trim()
    || (process.env.NODE_ENV === "production" ? "" : "dev");

  // Unset in production means closed, deliberately. A board that falls back to
  // a default password is a board with no password.
  if (!expected) {
    return fail(res, 503, "board_closed", "FACILITATOR_PASSWORD is not set.");
  }

  const provided = param(req, "key") ?? header(req, "x-facilitator-key");
  if (provided !== expected) return fail(res, 401, "bad_key");

  const [rows, events] = await Promise.all([store().listSessions(), store().allEvents()]);

  const bySession = new Map<string, StoredEvent[]>();
  for (const event of events) {
    const bucket = bySession.get(event.sessionId);
    if (bucket) bucket.push(event);
    else bySession.set(event.sessionId, [event]);
  }

  const reachedCount = new Map<string, number>();

  const sessions: BoardSession[] = rows.map((row) => {
    const mine = bySession.get(row.id) ?? [];
    const progress = deriveProgress(world(), mine);

    for (const id of progress.objectives) {
      reachedCount.set(id, (reachedCount.get(id) ?? 0) + 1);
    }

    return {
      id: row.id,
      displayName: row.displayName,
      startedAt: row.startedAt,
      lastSeenAt: row.lastSeenAt,
      objectives: [...progress.objectives],
      counters: countersFor(mine),
    };
  });

  const objectives: BoardObjective[] = world().allObjectives().map((objective) => ({
    id: objective.id,
    moduleId: objective.moduleId,
    title: objective.title,
    note: objective.note,
    hidden: objective.hidden ?? false,
    reachedBy: reachedCount.get(objective.id) ?? 0,
  }));

  res.status(200).json({
    now: Date.now(),
    storage: storageKind(),
    sessions: sessions.sort((a, b) => b.objectives.length - a.objectives.length),
    objectives,
    recent: events.slice(-80).reverse(),
    preflight: preflight(world(), false),
  } satisfies BoardView & { storage: string });
}

/**
 * Per-module counts of distinct files opened, plus failed credential attempts.
 *
 * Counting by module rather than by hard-coded path means a contributor's new
 * challenge shows up on the board the day they add it, with no board changes —
 * `desktop-notes` here is how you see who is grinding the notes folder.
 */
function countersFor(events: StoredEvent[]): Record<string, number> {
  const counters: Record<string, number> = {};
  const seen = new Set<string>();

  for (const event of events) {
    if (event.type === "node.open") {
      const path = String(event.payload.path ?? "");
      if (seen.has(path)) continue;
      seen.add(path);

      const moduleId = world().node(path)?.moduleId;
      if (moduleId) counters[moduleId] = (counters[moduleId] ?? 0) + 1;
      continue;
    }

    if (event.type === "login.attempt" && event.payload.ok === false) {
      counters.failedLogins = (counters.failedLogins ?? 0) + 1;
    }

    if (event.type === "web.auth" && event.payload.ok === false) {
      counters.failedPortalLogins = (counters.failedPortalLogins ?? 0) + 1;
    }

    if (event.type === "node.denied") {
      counters.denied = (counters.denied ?? 0) + 1;
    }
  }

  return counters;
}
