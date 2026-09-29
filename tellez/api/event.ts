/**
 * Batched telemetry from the client.
 *
 * Fire-and-forget by design: the client drops a failed flush rather than
 * retrying into a queue that grows forever. Telemetry must never be able to
 * degrade the experience it is measuring.
 */

import type { ClientEvent } from "../shared/protocol.js";
import { appAction, record } from "../server/engine.js";
import { requireSession } from "../server/guard.js";
import { bodyOf, methodIs, type ApiRequest, type ApiResponse } from "../server/http.js";

const ALLOWED: ReadonlySet<string> = new Set([
  "app.launch", "search.query", "app.action",
]);

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!methodIs(req, res, "POST")) return;

  const ctx = await requireSession(req, res);
  if (!ctx) return;

  const { events } = bodyOf<{ events: ClientEvent[] }>(req);
  const batch = (events ?? []).slice(0, 50);

  // The client may only report the event types it is the authority on. It does
  // not get to claim `objective.reached` or `node.open` — those are decided by
  // the server when it actually serves something.
  const allowed = batch.filter((event) => ALLOWED.has(event.type));

  const actions = allowed.filter((event) => event.type === "app.action");
  const plain = allowed.filter((event) => event.type !== "app.action");

  await record(ctx.session.id, plain);

  for (const action of actions) {
    await appAction(ctx, String(action.payload?.app ?? ""), String(action.payload?.action ?? ""));
  }

  res.status(200).json({ accepted: allowed.length });
}
