/**
 * Join, or resume.
 *
 * POST with a display name to start; GET to read the current session back;
 * DELETE to start over. Progress rides on the cookie, so closing the tab and
 * reopening it resumes exactly where the player was — which is why starting
 * over has to be a deliberate act rather than a refresh.
 *
 * DELETE only forgets the cookie. The old session and its events stay in the
 * store, so the facilitator board keeps the row of anyone who restarted.
 */

import type { SessionView } from "../shared/protocol.js";
import { store } from "../server/db.js";
import { loadCtx, record } from "../server/engine.js";
import { bodyOf, fail, type ApiRequest, type ApiResponse } from "../server/http.js";
import { clearedCookieHeader, cookieHeader, newSessionId } from "../server/session.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const method = (req.method ?? "GET").toUpperCase();
  if (method === "GET") return current(req, res);

  if (method === "DELETE") {
    res.setHeader("Set-Cookie", clearedCookieHeader());
    return res.status(200).json({ ok: true });
  }

  if (method !== "POST") {
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
  res.status(201).json({ id, displayName: name, startedAt: now } satisfies SessionView);
}

async function current(req: ApiRequest, res: ApiResponse) {
  const ctx = await loadCtx(req);
  if (!ctx) return fail(res, 401, "no_session");

  // No objective data, for the same reason as /api/desktop: progress is the
  // facilitator's to see, not the player's.
  res.status(200).json({
    id: ctx.session.id,
    displayName: ctx.session.displayName,
    startedAt: ctx.session.startedAt,
  } satisfies SessionView);
}
