/** One page from the simulated internet. */

import { visit } from "../../server/engine.js";
import { requireMachine } from "../../server/guard.js";
import { fail, param, type ApiRequest, type ApiResponse } from "../../server/http.js";
import { world } from "../../server/engine.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const ctx = await requireMachine(req, res);
  if (!ctx) return;

  const host = param(req, "host");
  const path = param(req, "path") ?? "/";
  if (!host) return fail(res, 400, "missing_host");

  // No such host is a DNS failure, not a 404 — the browser should show
  // "can't reach this site", the way a real one would.
  if (!world().site(host)) return fail(res, 404, "no_such_host");

  const outcome = await visit(ctx, host, path);

  if (outcome.status === "missing") return fail(res, 404, "no_such_page");
  if (outcome.status === "denied") return fail(res, 403, "needs_auth");

  res.status(200).json({
    host,
    path,
    route: outcome.route,
    title: outcome.title,
    data: outcome.data,
    needsAuth: outcome.needsAuth,
    challenge: outcome.challenge,
  });
}
