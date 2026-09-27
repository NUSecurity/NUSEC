/**
 * Join, or resume.
 *
 * POST with a display name to start; GET to read the current session back.
 * Progress rides on the cookie, so closing the tab and reopening it resumes
 * exactly where the player was.
 */

import type { SessionView } from "../shared/protocol.ts";
import { store } from "../server/db.ts";
import { loadCtx, record, world } from "../server/engine.ts";
import { bodyOf, fail, type ApiRequest, type ApiResponse } from "../server/http.ts";
import { cookieHeader, newSessionId } from "../server/session.ts";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if ((req.method ?? "GET").toUpperCase() === "GET") return current(req, res);
  if ((req.method ?? "GET").toUpperCase() !== "POST") {
    return fail(res, 405, "method_not_allowed");
  }

  const { displayName } = bodyOf<{ displayName: string }>(req);
  const name = (displayName ?? "").trim().slice(0, 40);

  if (name.length < 2) {
    return fail(res, 400, "bad_name", "Give a name of at least two characters.");
  }

  const now = Date.now();
  const id = newSessionId();

  await store().createSession({ id, displayName: name, startedAt: now, lastSeenAt: now });
  await record(id, [{ type: "session.start", at: now, payload: { displayName: name } }]);

  res.setHeader("Set-Cookie", cookieHeader(id));
  res.status(201).json({
    id, displayName: name, startedAt: now, objectives: [],
  } satisfies SessionView);
}

async function current(req: ApiRequest, res: ApiResponse) {
  const ctx = await loadCtx(req);
  if (!ctx) return fail(res, 401, "no_session");

  // Hidden objectives are withheld: the player should not learn that
  // `decoy-opened` exists, let alone that they have it.
  const visible = [...ctx.progress.objectives].filter(
    (id) => world().objective(id)?.hidden !== true,
  );

  res.status(200).json({
    id: ctx.session.id,
    displayName: ctx.session.displayName,
    startedAt: ctx.session.startedAt,
    objectives: visible,
  } satisfies SessionView);
}
