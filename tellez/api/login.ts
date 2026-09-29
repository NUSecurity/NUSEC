/** The lock screen. */

import type { LoginRequest, LoginResult } from "../shared/protocol.js";
import { machineLogin } from "../server/engine.js";
import { requireSession } from "../server/guard.js";
import { bodyOf, methodIs, type ApiRequest, type ApiResponse } from "../server/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!methodIs(req, res, "POST")) return;

  const ctx = await requireSession(req, res);
  if (!ctx) return;

  const { username, password } = bodyOf<LoginRequest>(req);
  const result = await machineLogin(ctx, username ?? "", password ?? "");

  res.status(200).json({
    ok: result.ok,
    message: result.ok ? undefined : "That did not work.",
    // The first hint for whichever half is wrong. See machineLogin for why
    // this intentionally reveals that the username was right.
    hint: result.hint,
  } satisfies LoginResult);
}
