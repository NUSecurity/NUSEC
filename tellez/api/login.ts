/** The lock screen. */

import type { LoginRequest, LoginResult, Revealed } from "../shared/protocol.js";
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
    // Deliberately identical whichever half was wrong: telling a player their
    // username was right would hand them half the answer for free.
    message: result.ok ? undefined : "The username or password is incorrect.",
    revealed: result.revealed,
  } satisfies LoginResult & Revealed);
}
