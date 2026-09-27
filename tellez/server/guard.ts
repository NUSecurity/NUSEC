/**
 * The two guards every handler starts with.
 *
 * Kept here rather than in `api/` so there is exactly one place where "may
 * this request see anything at all" is decided.
 */

import { loadCtx, machineUnlocked, touch, type Ctx } from "./engine.ts";
import { fail, type ApiRequest, type ApiResponse } from "./http.ts";

/** A valid signed cookie backed by a real session row. */
export async function requireSession(req: ApiRequest, res: ApiResponse): Promise<Ctx | null> {
  const ctx = await loadCtx(req);
  if (!ctx) {
    fail(res, 401, "no_session", "Join first.");
    return null;
  }

  void touch(ctx.session.id);
  return ctx;
}

/**
 * A session that has also got past the lock screen. Everything in the
 * filesystem and on the simulated internet is behind this, which is what makes
 * the lock screen a real gate: before it, the server will not serve a single
 * byte of the machine.
 */
export async function requireMachine(req: ApiRequest, res: ApiResponse): Promise<Ctx | null> {
  const ctx = await requireSession(req, res);
  if (!ctx) return null;

  if (!machineUnlocked(ctx)) {
    fail(res, 403, "machine_locked", "The workstation is locked.");
    return null;
  }

  return ctx;
}
