/**
 * The service layer. Handlers in `api/` are thin wrappers over this.
 *
 * Everything that decides whether a player may see something lives here or in
 * the pure modules it calls, so the answer is never spread across HTTP
 * plumbing.
 */

import type {
  ApprovalRequest, ChallengeAnswer, ChallengeView, ClientEvent, DirListing, NodeContent,
  ObjectiveId, SecretId, SiteHost, StoredEvent,
} from "../shared/protocol.js";
import { randomUUID } from "node:crypto";
import { MACHINE } from "./content/machine.js";
import { modules } from "./content/modules/index.js";
import { store, type SessionRow } from "./db.js";
import { NOT_STARTED, type ChallengeState, type Progress } from "./locks.js";
import {
  cascade, deriveProgress, objectivesForAction, objectivesForChallenge, objectivesForOpen,
  objectivesForSecret, objectivesForVisit,
} from "./objectives.js";
import { decodeCookie, readCookie } from "./session.js";
import type { Secret, SiteChallenge } from "./types.js";
import { Directory, FileNode, type ContentContext } from "./vfs.js";
import { World } from "./world.js";

/* ----------------------------------------------------------------- world */

let cachedWorld: World | null = null;

/** Built once per serverless instance; content is static for a deployment. */
export function world(): World {
  cachedWorld ??= new World(modules);
  return cachedWorld;
}

/* --------------------------------------------------------------- session */

export interface Ctx {
  session: SessionRow;
  progress: Progress;
}

export async function loadCtx(req: { headers: Record<string, string | string[] | undefined> }): Promise<Ctx | null> {
  const raw = readCookie(Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie);
  const id = decodeCookie(raw);
  if (!id) return null;

  const session = await store().getSession(id);
  if (!session) return null;

  const events = await store().eventsFor(id);
  return { session, progress: deriveProgress(world(), events) };
}

export async function touch(sessionId: string): Promise<void> {
  await store().touchSession(sessionId, Date.now());
}

/* ---------------------------------------------------------------- events */

export async function record(sessionId: string, events: ClientEvent[]): Promise<void> {
  const stored: StoredEvent[] = events.map((event) => ({
    id: randomUUID(),
    sessionId,
    at: Number.isFinite(event.at) ? event.at : Date.now(),
    type: event.type,
    payload: event.payload ?? {},
  }));

  await store().appendEvents(stored);
}

/**
 * Marks objectives reached, skipping any the session already has, and resolves
 * any composite objective the new ones complete. Returns only what is new, so
 * the caller can show a toast for exactly that.
 */
export async function reach(
  ctx: Ctx,
  ids: ObjectiveId[],
): Promise<ObjectiveId[]> {
  if (ids.length === 0) return [];

  const before = ctx.progress.objectives;
  const after = cascade(world(), new Set([...before, ...ids]));
  const fresh = [...after].filter((id) => !before.has(id));
  if (fresh.length === 0) return [];

  await record(
    ctx.session.id,
    fresh.map((id) => ({
      type: "objective.reached" as const,
      at: Date.now(),
      payload: { id },
    })),
  );

  ctx.progress = { ...ctx.progress, objectives: after };
  return fresh;
}

/* --------------------------------------------------------------- secrets */

/** Trim and fold case unless the author said otherwise. */
export function normalise(secret: Secret, input: string): string {
  const steps = secret.normalise ?? ["trim", "lower"];
  let value = input;

  for (const step of steps) {
    if (step === "trim") value = value.trim();
    if (step === "lower") value = value.toLowerCase();
    if (step === "alnum") value = value.replace(/[^a-z0-9]/gi, "");
  }

  return value;
}

function expected(secret: Secret): string {
  const fromEnv = secret.env ? process.env[secret.env]?.trim() : undefined;
  return fromEnv && fromEnv.length > 0 ? fromEnv : secret.value;
}

export function secretMatches(secret: Secret, input: string): boolean {
  const given = normalise(secret, input);
  return [expected(secret), ...(secret.accepts ?? [])].some((answer) => given === normalise(secret, answer));
}

/**
 * Credits passed credentials to the session — both in memory for the rest of
 * this request, and as `secret.submit` events so the next request still knows.
 *
 * Every successful credential check goes through here. Progress is derived
 * from the event log, so a caller that updated `ctx.progress` without writing
 * an event would appear to work and then forget on the very next request: the
 * portal would accept a login and immediately refuse the page behind it.
 */
async function creditSecrets(ctx: Ctx, ids: SecretId[]): Promise<void> {
  const fresh = ids.filter((id) => !ctx.progress.secrets.has(id));
  if (fresh.length === 0) return;

  await record(
    ctx.session.id,
    fresh.map((id) => ({ type: "secret.submit" as const, at: Date.now(), payload: { id, ok: true } })),
  );

  ctx.progress = {
    ...ctx.progress,
    secrets: new Set([...ctx.progress.secrets, ...fresh]),
  };
}

/**
 * Checks a typed credential, records the attempt either way, and fires any
 * objective the secret triggers. Recording failures is deliberate: the board
 * showing who is trying and failing is how you tell a stuck room from an idle
 * one.
 */
export async function submitSecret(
  ctx: Ctx,
  id: SecretId,
  input: string,
): Promise<{ ok: boolean; revealed: ObjectiveId[] }> {
  const secret = world().secret(id);
  if (!secret) return { ok: false, revealed: [] };

  const ok = secretMatches(secret, input);

  if (!ok) {
    await record(ctx.session.id, [
      { type: "secret.submit", at: Date.now(), payload: { id, ok: false } },
    ]);
    return { ok: false, revealed: [] };
  }

  await creditSecrets(ctx, [id]);
  const revealed = await reach(ctx, objectivesForSecret(world(), id));
  return { ok: true, revealed };
}

/* --------------------------------------------------------- the machine */

/**
 * The one objective the engine knows by name. Every filesystem and web request
 * refuses until a session has it, which is what makes the lock screen a real
 * gate rather than a curtain drawn on the client.
 */
export function machineUnlocked(ctx: Ctx): boolean {
  return ctx.progress.objectives.has(MACHINE.unlockedObjective);
}

/**
 * The lock screen.
 *
 * A failed attempt hands back the first hint for whichever half is wrong —
 * the username hint until the username is right, then the password hint. That
 * deliberately makes this a username oracle, which would be a flaw on a real
 * login and is the point here: getting in is the opening move, not the
 * challenge, and a room stuck on the front door learns nothing.
 *
 * Failures are recorded as well as successes. The board showing who is trying
 * and failing is how you tell a stuck room from an idle one.
 */
export async function machineLogin(
  ctx: Ctx,
  username: string,
  password: string,
): Promise<{ ok: boolean; hint?: string }> {
  const userSecret = world().secret("machine-username");
  const passSecret = world().secret("machine-password");
  if (!userSecret || !passSecret) return { ok: false };

  const userOk = secretMatches(userSecret, username);
  const passOk = secretMatches(passSecret, password);
  const ok = userOk && passOk;

  await record(ctx.session.id, [
    { type: "login.attempt", at: Date.now(), payload: { username, ok, userOk } },
  ]);

  if (!ok) return { ok: false, hint: (userOk ? passSecret : userSecret).hints?.[0] };

  await creditSecrets(ctx, [userSecret.id, passSecret.id]);

  await reach(ctx, [
    ...objectivesForSecret(world(), userSecret.id),
    ...objectivesForSecret(world(), passSecret.id),
  ]);

  return { ok: true };
}

/* ------------------------------------------------------------ filesystem */

export type ListOutcome =
  | { status: "ok"; listing: DirListing; revealed: ObjectiveId[] }
  | { status: "missing" }
  | { status: "denied" };

/**
 * Entering a folder is itself a discovery, so a listing fires objectives the
 * same way opening a file does — `recycle-bin-opened` depends on it.
 */
export async function listDirectory(
  ctx: Ctx,
  path: string,
  showHidden: boolean,
): Promise<ListOutcome> {
  const node = world().node(path);
  if (!node) return { status: "missing" };

  const unlocked = node.lock.isOpen(ctx.progress);
  if (!unlocked && node.visibility === "concealed") return { status: "missing" };

  if (!unlocked) {
    await record(ctx.session.id, [
      { type: "node.denied", at: Date.now(), payload: { path: node.path } },
    ]);
    return { status: "denied" };
  }

  const listing = world().listing(path, ctx.progress, showHidden);
  if (!listing) return { status: "missing" };

  await record(ctx.session.id, [
    { type: "node.open", at: Date.now(), payload: { path: node.path, kind: "dir" } },
  ]);

  const revealed = await reach(ctx, objectivesForOpen(world(), node.path));
  return { status: "ok", listing, revealed };
}

export type OpenOutcome =
  | { status: "ok"; content: NodeContent; opensWith: string; summary: ReturnType<FileNode["summary"]>; revealed: ObjectiveId[] }
  | { status: "missing" }
  | { status: "denied" }
  | { status: "is_directory" };

export async function openNode(ctx: Ctx, path: string): Promise<OpenOutcome> {
  const node = world().node(path);
  if (!node) return { status: "missing" };

  const unlocked = node.lock.isOpen(ctx.progress);

  // A concealed node answers 404, not 403, when it is still locked. Answering
  // "forbidden" would confirm the path exists, turning path-guessing into a
  // reliable way to map every secret in the game without finding any of them.
  if (!unlocked && node.visibility === "concealed") return { status: "missing" };

  if (!unlocked) {
    await record(ctx.session.id, [
      { type: "node.denied", at: Date.now(), payload: { path: node.path } },
    ]);
    return { status: "denied" };
  }

  if (node instanceof Directory) return { status: "is_directory" };
  if (!(node instanceof FileNode)) return { status: "missing" };

  await record(ctx.session.id, [
    { type: "node.open", at: Date.now(), payload: { path: node.path, kind: node.kind } },
  ]);

  const revealed = await reach(ctx, objectivesForOpen(world(), node.path));

  return {
    status: "ok",
    content: node.content(contentContext(ctx, node.path)),
    opensWith: node.opensWith,
    summary: node.summary(),
    revealed,
  };
}

function contentContext(ctx: Ctx, nodePath: string): ContentContext {
  return {
    progress: ctx.progress,
    assetUrl: (asset) =>
      `/api/fs/asset?path=${encodeURIComponent(nodePath)}&name=${encodeURIComponent(asset)}`,
  };
}

/* ------------------------------------------------------- simulated web */

export type VisitOutcome =
  | {
      status: "ok"; route: string; title: string; data: unknown; needsAuth: boolean;
      challenge?: ChallengeView; revealed: ObjectiveId[];
    }
  | { status: "missing" }
  | { status: "denied" };

export async function visit(ctx: Ctx, host: SiteHost, path: string): Promise<VisitOutcome> {
  const match = world().resolveRoute(host, path);
  if (!match) return { status: "missing" };

  const { site, route } = match;

  await relockChallenges(ctx, { host: site.host, path: route.path });

  if (route.lock && !route.lock.isOpen(ctx.progress)) return { status: "denied" };

  // The auth wall. Protected routes are never rendered — and more to the point
  // their data is never serialised — until the session has passed the wall.
  // A challenge's routes are always behind the wall of the site they sit on.
  const challenge = world().challengeFor(site.host, route.path);
  const walled =
    (site.auth?.protects.some((p) => samePath(p, route.path)) ?? false) ||
    (challenge !== undefined && site.auth !== undefined);
  if (walled && !hasPassedAuth(ctx, site.auth!.passwordSecret)) {
    return { status: "denied" };
  }

  // An unfinished challenge serves its current step in place of the route. The
  // route's own objectives do not fire: the player has not seen it yet.
  if (challenge) {
    const state = challengeState(ctx, challenge.id);

    if (state.done < challenge.steps.length) {
      await record(ctx.session.id, [
        {
          type: "web.visit",
          at: Date.now(),
          payload: { host: site.host, path: route.path, challenge: challenge.id, step: state.done },
        },
      ]);

      return {
        status: "ok",
        route: route.path,
        title: route.title ?? site.title,
        data: null,
        needsAuth: walled,
        challenge: challengeView(challenge, state),
        revealed: [],
      };
    }
  }

  // Tagged with the challenge, if any, because an open relocking challenge
  // stays open only while its pages keep being loaded.
  await record(ctx.session.id, [
    {
      type: "web.visit",
      at: Date.now(),
      payload: { host: site.host, path: route.path, ...(challenge ? { challenge: challenge.id } : {}) },
    },
  ]);

  const revealed = await reach(ctx, objectivesForVisit(world(), site.host, route.path));

  return {
    status: "ok",
    // The matched *pattern*, not the requested path: the client looks its
    // renderer up by pattern, so "/member/:slug" resolves for every member.
    route: route.path,
    title: route.title ?? site.title,
    data: route.data ?? null,
    needsAuth: walled,
    revealed,
  };
}

function hasPassedAuth(ctx: Ctx, passwordSecret: SecretId): boolean {
  return ctx.progress.secrets.has(passwordSecret);
}

/** A site login: both halves must match before either counts. */
export async function authenticate(
  ctx: Ctx,
  host: SiteHost,
  username: string,
  password: string,
): Promise<{ ok: boolean; revealed: ObjectiveId[] }> {
  const site = world().site(host);
  if (!site?.auth) return { ok: false, revealed: [] };

  const userSecret = world().secret(site.auth.usernameSecret);
  const passSecret = world().secret(site.auth.passwordSecret);
  if (!userSecret || !passSecret) return { ok: false, revealed: [] };

  const ok = secretMatches(userSecret, username) && secretMatches(passSecret, password);

  await record(ctx.session.id, [
    { type: "web.auth", at: Date.now(), payload: { host: site.host, ok } },
  ]);

  if (!ok) return { ok: false, revealed: [] };

  await creditSecrets(ctx, [userSecret.id, passSecret.id]);

  const revealed = await reach(ctx, [
    ...(site.auth.reveals ?? []),
    ...objectivesForSecret(world(), userSecret.id),
    ...objectivesForSecret(world(), passSecret.id),
  ]);

  return { ok: true, revealed };
}

/* ------------------------------------------------------ site challenges */

function challengeState(ctx: Ctx, id: string): ChallengeState {
  return ctx.progress.challenges.get(id) ?? NOT_STARTED;
}

/** How long an open relocking challenge survives without one of its pages loading. */
const RELOCK_IDLE_MS = 10 * 60 * 1000;

/**
 * Closes every `relock` challenge the session has walked away from: any page
 * outside its routes when `visiting` is given, or too long since it was last
 * looked at. Recorded as a reset, so the next attempt starts cleanly at step
 * one both here and when the log is replayed.
 */
async function relockChallenges(ctx: Ctx, visiting?: { host: SiteHost; path: string }): Promise<void> {
  const resets: ClientEvent[] = [];
  const next = new Map(ctx.progress.challenges);

  for (const challenge of world().allChallenges()) {
    if (!challenge.relock) continue;

    const state = challengeState(ctx, challenge.id);
    if (state.done === 0) continue;

    const left = visiting !== undefined &&
      world().challengeFor(visiting.host, visiting.path)?.id !== challenge.id;
    const idle = state.done >= challenge.steps.length && Date.now() - state.seen > RELOCK_IDLE_MS;
    if (!left && !idle) continue;

    resets.push({
      type: "challenge.reset",
      at: Date.now(),
      payload: { challenge: challenge.id, reason: left ? "left" : "idle" },
    });
    next.set(challenge.id, NOT_STARTED);
  }

  if (resets.length === 0) return;
  await record(ctx.session.id, resets);
  ctx.progress = { ...ctx.progress, challenges: next };
}

function challengeView(challenge: SiteChallenge, state: ChallengeState): ChallengeView {
  const step = challenge.steps[state.done];

  return {
    id: challenge.id,
    step: state.done + 1,
    of: challenge.steps.length,
    kind: step.kind,
    prompt: step.prompt,
    label: step.kind === "secret" ? step.label : undefined,
    questions: step.kind === "questions" ? step.questions.map((q) => q.label) : undefined,
    notice: state.denied ? "denied" : undefined,
  };
}

/**
 * Whether the session may work on a challenge at all: the same test as
 * visiting its first route. Without this, the step endpoint would be a way
 * round the site's own login wall.
 */
function mayAttempt(ctx: Ctx, challenge: SiteChallenge): boolean {
  const site = world().site(challenge.host);
  const entry = challenge.routes[0];
  if (!site || !entry) return false;
  if (entry.lock && !entry.lock.isOpen(ctx.progress)) return false;
  return !site.auth || hasPassedAuth(ctx, site.auth.passwordSecret);
}

export type ChallengeOutcome =
  | { status: "ok" }
  | { status: "wrong"; message: string }
  | { status: "missing" };

/**
 * One step of a site challenge. Every attempt is recorded, and a failed one
 * records which answers were wrong — for the board, never for the player.
 */
export async function answerChallenge(ctx: Ctx, input: Partial<ChallengeAnswer>): Promise<ChallengeOutcome> {
  const challenge = world().challenge(String(input.challenge ?? ""));
  if (!challenge || !mayAttempt(ctx, challenge)) return { status: "missing" };

  await relockChallenges(ctx);

  const state = challengeState(ctx, challenge.id);
  const step = challenge.steps[state.done];
  if (!step) return { status: "ok" };

  const fail = async (message: string, payload: Record<string, unknown> = {}) => {
    await record(ctx.session.id, [
      {
        type: "challenge.step",
        at: Date.now(),
        payload: { challenge: challenge.id, step: state.done, kind: step.kind, ok: false, ...payload },
      },
    ]);
    return { status: "wrong" as const, message };
  };

  if (step.kind === "secret") {
    const secret = world().secret(step.secret);
    if (typeof input.answer !== "string") return fail("Enter your password to continue.");
    if (!secret || !secretMatches(secret, input.answer)) return fail("That password was not accepted.");
  }

  if (step.kind === "questions") {
    const answers = Array.isArray(input.answers) ? input.answers : [];
    const wrong = step.questions
      .map((question, index) => {
        const secret = world().secret(question.secret);
        const answer = answers[index];
        return secret && typeof answer === "string" && secretMatches(secret, answer) ? -1 : index;
      })
      .filter((index) => index >= 0);

    if (wrong.length > 0) return fail("One or more answers were incorrect.", { wrong });
  }

  if (step.kind === "approval") {
    if (input.decision === "deny") {
      await record(ctx.session.id, [
        { type: "challenge.reset", at: Date.now(), payload: { challenge: challenge.id, reason: "denied" } },
      ]);
      return { status: "ok" };
    }
    // The page asking again is not an approval; only the app can give one.
    if (input.decision !== "approve") return { status: "wrong", message: "Waiting for approval." };
  }

  await record(ctx.session.id, [
    {
      type: "challenge.step",
      at: Date.now(),
      payload: { challenge: challenge.id, step: state.done, kind: step.kind, ok: true },
    },
  ]);

  const done = state.done + 1;
  ctx.progress = {
    ...ctx.progress,
    challenges: new Map([
      ...ctx.progress.challenges,
      [challenge.id, { done, denied: false, at: Date.now(), seen: Date.now() }],
    ]),
  };

  await reach(ctx, objectivesForChallenge(world(), challenge.id, done));
  return { status: "ok" };
}

/** Approvals waiting in one app, e.g. the pushes the Authenticator should show. */
export function pendingApprovals(ctx: Ctx, app: string): ApprovalRequest[] {
  return world()
    .allChallenges()
    .flatMap((challenge) => {
      const state = challengeState(ctx, challenge.id);
      const step = challenge.steps[state.done];
      if (step?.kind !== "approval" || step.app !== app || !mayAttempt(ctx, challenge)) return [];

      return [{
        challenge: challenge.id,
        host: challenge.host,
        site: world().site(challenge.host)?.title ?? challenge.host,
        request: step.request,
        at: state.at,
      }];
    });
}

/* ------------------------------------------------------------ app action */

export async function appAction(
  ctx: Ctx,
  app: string,
  action: string,
): Promise<ObjectiveId[]> {
  await record(ctx.session.id, [
    { type: "app.action", at: Date.now(), payload: { app, action } },
  ]);
  return reach(ctx, objectivesForAction(world(), app, action));
}

function samePath(a: string, b: string): boolean {
  const clean = (raw: string) => raw.replace(/\/+$/, "").toLowerCase() || "/";
  return clean(a) === clean(b);
}
