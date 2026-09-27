/** A login wall on a simulated site. */

import type { AuthRequest, AuthResult, Revealed } from "../../shared/protocol.ts";
import { authenticate } from "../../server/engine.ts";
import { requireMachine } from "../../server/guard.ts";
import { bodyOf, fail, methodIs, type ApiRequest, type ApiResponse } from "../../server/http.ts";

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
    revealed: result.revealed,
  } satisfies AuthResult & Revealed);
}
