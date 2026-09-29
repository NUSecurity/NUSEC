/** A login wall on a simulated site. */

import type { AuthRequest, AuthResult } from "../../shared/protocol.js";
import { authenticate } from "../../server/engine.js";
import { requireMachine } from "../../server/guard.js";
import { bodyOf, fail, methodIs, type ApiRequest, type ApiResponse } from "../../server/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!methodIs(req, res, "POST")) return;

  const ctx = await requireMachine(req, res);
  if (!ctx) return;

  const { host, username, password } = bodyOf<AuthRequest>(req);
  if (!host) return fail(res, 400, "missing_host");

  const result = await authenticate(ctx, host, username ?? "", password ?? "");

  res.status(200).json({
    ok: result.ok,
    message: result.ok ? undefined : "Those credentials were not accepted.",
  } satisfies AuthResult);
}
