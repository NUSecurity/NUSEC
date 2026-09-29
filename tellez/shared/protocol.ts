/**
 * The client/server contract.
 *
 * Types only — never data, and never a value a participant has not earned.
 * This is the one module that both sides import, which is what keeps the
 * content gate honest: `client/` may import from here and from nowhere else
 * on the server.
 */

/* ------------------------------------------------------------------ ids */

export type NodeKind =
  | "dir" | "text" | "sheet" | "mail" | "chat"
  | "image" | "video" | "archive" | "encrypted" | "shortcut" | "binary";

export type AppId = string;
export type SiteHost = string;
export type ModuleId = string;
export type ObjectiveId = string;
export type SecretId = string;

export type NodeAttribute = "hidden" | "system" | "readonly" | "encrypted";

/* ------------------------------------------------------- filesystem wire */

export interface NodeMeta {
  createdAt: number;
  modifiedAt: number;
  accessedAt: number;
  sizeBytes: number;
  attributes: NodeAttribute[];
  /**
   * Set on recycle-bin items. `originalPath` is deliberately part of the wire
   * format: a deleted file telling you where it used to live is evidence, and
   * is how a player learns that a folder they have never seen exists.
   */
  deleted?: { at: number; originalPath: string };
  owner?: string;
}

/** One row in a directory listing. Carries no body. */
export interface NodeSummary {
  path: string;
  name: string;
  kind: NodeKind;
  meta: NodeMeta;
}

export interface DirListing {
  path: string;
  parent: string | null;
  entries: NodeSummary[];
}

export interface MailMessage {
  from: string; to: string[]; subject: string; at: number; body: string;
}

export interface ChatMessage {
  author: string; at: number; body: string; channel?: string;
}

export type Cell = string | number | null;

/** The payload for a single opened file, discriminated by `kind`. */
export type NodeContent =
  | { kind: "text"; body: string }
  | { kind: "sheet"; columns: string[]; rows: Cell[][]; note?: string }
  | { kind: "mail"; messages: MailMessage[] }
  | { kind: "chat"; messages: ChatMessage[] }
  | { kind: "image"; assetUrl: string; caption?: string }
  | { kind: "video"; assetUrl: string; poster?: string; caption?: string }
  | { kind: "archive"; entries: NodeSummary[]; locked: boolean }
  | { kind: "encrypted"; hint?: string }
  | { kind: "shortcut"; target: string; targetKind: "path" | "url" }
  | { kind: "binary"; hexPreview: string };

export interface OpenedNode {
  summary: NodeSummary;
  content: NodeContent;
  /** Which app should render this. Resolved server-side from the node kind. */
  opensWith: AppId;
}

/* -------------------------------------------------- simulated web wire */

export interface SitePage {
  host: SiteHost;
  path: string;
  title: string;
  /**
   * Opaque JSON handed to the site's registered renderer. The engine never
   * looks inside it; a site author decides its shape.
   */
  data: unknown;
  /** True when this host has an auth wall the session has not yet passed. */
  needsAuth: boolean;
}

/**
 * The step a session is on in a site challenge — a multi-step gate in front of
 * part of a site. Only the *current* step is ever described: the questions of
 * step three do not reach the browser while the player is still on step one.
 */
export interface ChallengeView {
  id: string;
  /** 1-based, for "step 2 of 3" in the page itself. */
  step: number;
  of: number;
  kind: "secret" | "approval" | "questions";
  prompt: string;
  /** The field label for a `secret` step. */
  label?: string;
  /** One label per answer box, for a `questions` step. */
  questions?: string[];
  /** Set when the last approval request was declined and the gate started over. */
  notice?: "denied";
}

/** An approval waiting in an in-world app, e.g. a push to the Authenticator. */
export interface ApprovalRequest {
  challenge: string;
  host: SiteHost;
  site: string;
  request: string;
  at: number;
}

export interface ChallengeAnswer {
  challenge: string;
  answer?: string;
  answers?: string[];
  decision?: "approve" | "deny";
}

export interface ChallengeResult { ok: boolean; message?: string }

export interface SiteSummary {
  host: SiteHost;
  title: string;
  discoverable: boolean;
}

/* ------------------------------------------------------ session + events */

/**
 * Note the absence of any progress field. Participants are never told what
 * they have found; objectives exist for the facilitator board alone.
 */
export interface SessionView {
  id: string;
  displayName: string;
  startedAt: number;
}

export type EventType =
  | "session.start"
  | "login.attempt"
  | "node.open"
  | "node.denied"
  | "app.launch"
  | "secret.submit"
  | "web.visit"
  | "web.auth"
  | "challenge.step"
  | "challenge.reset"
  | "objective.reached"
  | "app.action"
  | "search.query";

export interface ClientEvent {
  type: EventType;
  at: number;
  payload?: Record<string, unknown>;
}

export interface StoredEvent extends ClientEvent {
  id: string;
  sessionId: string;
  payload: Record<string, unknown>;
}

/* ------------------------------------------------------- facilitator wire */

export interface BoardObjective {
  id: ObjectiveId;
  moduleId: ModuleId;
  title: string;
  note?: string;
  hidden: boolean;
  reachedBy: number;
}

export interface BoardSession {
  id: string;
  displayName: string;
  startedAt: number;
  lastSeenAt: number;
  objectives: ObjectiveId[];
  /** Counters the board surfaces directly, e.g. how many notes were read. */
  counters: Record<string, number>;
}

export interface BoardView {
  now: number;
  sessions: BoardSession[];
  objectives: BoardObjective[];
  recent: StoredEvent[];
  preflight: { ok: boolean; problems: string[] };
}

/* ------------------------------------------------------------ api shapes */

export interface ApiError { error: string; detail?: string }

export interface LoginRequest { username: string; password: string }
export interface LoginResult { ok: boolean; message?: string; hint?: string }

export interface AuthRequest { host: SiteHost; username: string; password: string }
export interface AuthResult { ok: boolean; message?: string }

export interface UnlockRequest { path: string; passphrase: string }
export interface UnlockResult { ok: boolean; message?: string }
