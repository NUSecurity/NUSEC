/**
 * The service layer. Handlers in `api/` are thin wrappers over this.
 *
 * Everything that decides whether a player may see something lives here or in
 * the pure modules it calls, so the answer is never spread across HTTP
 * plumbing.
 */

import type {
  ClientEvent, DirListing, NodeContent, ObjectiveId, SecretId, SiteHost, StoredEvent,
} from "../shared/protocol.js";
import { randomUUID } from "node:crypto";
import { MACHINE } from "./content/machine.js";
import { modules } from "./content/modules/index.js";
import { store, type SessionRow } from "./db.js";
import { type Progress } from "./locks.js";
import {
  cascade, deriveProgress, objectivesForAction, objectivesForOpen,
  objectivesForSecret, objectivesForVisit,
} from "./objectives.js";
import { decodeCookie, readCookie } from "./session.js";
import type { Secret } from "./types.js";
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

  ctx.progress = { objectives: after, secrets: ctx.progress.secrets };
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
  return normalise(secret, input) === normalise(secret, expected(secret));
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
    objectives: ctx.progress.objectives,
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
  | { status: "ok"; route: string; title: string; data: unknown; needsAuth: boolean; revealed: ObjectiveId[] }
  | { status: "missing" }
  | { status: "denied" };

export async function visit(ctx: Ctx, host: SiteHost, path: string): Promise<VisitOutcome> {
  const match = world().resolveRoute(host, path);
  if (!match) return { status: "missing" };

  const { site, route } = match;

  if (route.lock && !route.lock.isOpen(ctx.progress)) return { status: "denied" };

  // The auth wall. Protected routes are never rendered — and more to the point
  // their data is never serialised — until the session has passed the wall.
  const walled = site.auth?.protects.some((p) => samePath(p, route.path)) ?? false;
  if (walled && !hasPassedAuth(ctx, site.auth!.passwordSecret)) {
    return { status: "denied" };
  }

  await record(ctx.session.id, [
    { type: "web.visit", at: Date.now(), payload: { host: site.host, path: route.path } },
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
