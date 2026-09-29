/**
 * Site challenges — both ends of them.
 *
 * GET lists the approvals waiting in one in-world app (`?app=authenticator`);
 * POST answers the current step of a challenge, from the page or from the app.
 *
 * One file for both on purpose: every file in `api/` is a Vercel function, and
 * the Hobby plan stops at twelve. This is the twelfth.
 */

import type { ChallengeAnswer, ChallengeResult } from "../../shared/protocol.js";
import { answerChallenge, pendingApprovals } from "../../server/engine.js";
import { requireMachine } from "../../server/guard.js";
import { bodyOf, fail, param, type ApiRequest, type ApiResponse } from "../../server/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const ctx = await requireMachine(req, res);
  if (!ctx) return;

  const method = (req.method ?? "GET").toUpperCase();

  if (method === "GET") {
    const app = param(req, "app");
    if (!app) return fail(res, 400, "missing_app");
    return res.status(200).json({ requests: pendingApprovals(ctx, app) });
  }

  if (method !== "POST") return fail(res, 405, "method_not_allowed", "expected GET or POST");

  const outcome = await answerChallenge(ctx, bodyOf<ChallengeAnswer>(req));

  // Not found and not yet allowed look the same, as they do everywhere else.
  if (outcome.status === "missing") return fail(res, 404, "no_such_challenge");

  res.status(200).json({
    ok: outcome.status === "ok",
    message: outcome.status === "wrong" ? outcome.message : undefined,
  } satisfies ChallengeResult);
}
