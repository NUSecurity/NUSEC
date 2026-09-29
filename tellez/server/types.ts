/**
 * The authoring types.
 *
 * A content module is the only unit anyone needs to write. It contributes
 * files, objectives, credentials, websites and desktop icons to one shared
 * world; the engine merges every module and refuses to start if two of them
 * collide. Nothing here is ordered — numeric filename prefixes in
 * `content/modules/` are for human scanning only.
 */

import type {
  AppId, ModuleId, ObjectiveId, SecretId, SiteHost,
} from "../shared/protocol.js";
import type { LockRule } from "./locks.js";
import type { VfsNode } from "./vfs.js";

/* ------------------------------------------------------------ objectives */

/**
 * Something worth knowing a player has done. These are the "flags" of a game
 * with no flags: most fire implicitly from opening a file, and the player is
 * never told they exist.
 */
export interface Objective {
  id: ObjectiveId;
  title: string;
  /**
   * What it means when this lights up on the projector. Write it — somebody is
   * reading the board live and has to decide whether the room is stuck.
   */
  note?: string;
  /** Hidden objectives never appear in the player's own progress display. */
  hidden?: boolean;
  trigger: ObjectiveTrigger;
}

export type ObjectiveTrigger =
  | { on: "open"; path: string }
  | { on: "secret"; id: SecretId }
  | { on: "appAction"; app: AppId; action: string }
  | { on: "visit"; host: SiteHost; path?: string }
  /** Fires once `step` steps are passed. Omit `step` for the whole challenge. */
  | { on: "challenge"; id: string; step?: number }
  | { on: "all"; objectives: ObjectiveId[] };

/* --------------------------------------------------------------- secrets */

/**
 * A credential a player types: a login password, an archive passphrase.
 *
 * `value` lives in the module file. The repository is public and participants
 * are trusted to act in good faith, so env-var indirection would protect
 * nothing while costing every author a deploy round-trip. `env` stays as an
 * escape hatch for anything genuinely worth hiding. Either way the value is
 * compared inside a serverless function and never reaches the browser.
 */
export interface Secret {
  id: SecretId;
  value: string;
  /**
   * Other answers that also count — "thu" for "thursday". Only for free-text
   * answers where a person could reasonably phrase the same fact two ways; a
   * password has exactly one spelling.
   */
  accepts?: string[];
  env?: string;
  /** Applied to both sides before comparison. Defaults to trim + lowercase. */
  normalise?: ("trim" | "lower" | "alnum")[];
  /** Released to the room from the facilitator board when people are stuck. */
  hints?: string[];
}

/* ------------------------------------------------- the simulated internet */

export interface SiteAuth {
  usernameSecret: SecretId;
  passwordSecret: SecretId;
  reveals?: ObjectiveId[];
  /** Route paths that require a passed auth wall. */
  protects: string[];
}

export interface SimRoute {
  /** `/`, `/invoices`, or a pattern like `/invoices/:id`. */
  path: string;
  title?: string;
  lock?: LockRule;
  reveals?: ObjectiveId[];
  /**
   * Handed verbatim to the renderer registered for this host and path on the
   * client. The engine never looks inside it, so a site author owns its shape
   * completely.
   */
  data?: unknown;
}

export interface SimSite {
  host: SiteHost;
  title: string;
  /** Listed by the in-world search engine. Leave false for a site you must find. */
  discoverable?: boolean;
  auth?: SiteAuth;
  routes: SimRoute[];
}

/**
 * A multi-step gate in front of part of a site, declared by any module.
 *
 * The challenge brings its own routes and the world adds them to `host`, so a
 * module can put a locked section on somebody else's site without editing
 * their file. Its routes sit behind that site's login wall too, if it has one.
 *
 * Steps are passed strictly in order, and until the last is passed the routes
 * serve the current step instead of their `data` — which is never serialised
 * to a session that has not finished.
 */
export interface SiteChallenge {
  id: string;
  host: SiteHost;
  /** The first route is the one players land on. */
  routes: SimRoute[];
  steps: ChallengeStep[];
  /**
   * Open for one visit only. Loading any page outside this challenge's routes,
   * or ten minutes without loading one of them, closes it again and the next
   * visit starts from step one. Omit it and a passed challenge stays passed.
   */
  relock?: boolean;
}

export type ChallengeStep =
  /** Type one credential. */
  | { kind: "secret"; prompt: string; label: string; secret: SecretId }
  /**
   * Approve a push in an in-world app. Declining it sends the whole challenge
   * back to its first step, the way a denied sign-in makes you start again.
   */
  | { kind: "approval"; prompt: string; app: AppId; request: string }
  /** Answer every question at once. A wrong answer never says which one. */
  | { kind: "questions"; prompt: string; questions: { label: string; secret: SecretId }[] };

/* ------------------------------------------------------------ desktop UI */

export interface DesktopItem {
  label: string;
  /** Lucide icon name. Original icons only — never Microsoft assets. */
  icon: string;
  /** A filesystem path, or an app id prefixed `app:`, or a `url:` target. */
  target: string;
  /** Grid position. Omit and the desktop places it in the next free slot. */
  column?: number;
  row?: number;
}

export interface StartMenuItem {
  label: string;
  icon: string;
  appId: AppId;
}

/* ----------------------------------------------------------- the module */

export interface ContentModule {
  id: ModuleId;
  title: string;
  /** Facilitator-facing: what a player does here, in one sentence. */
  summary: string;
  nodes?: VfsNode[];
  objectives?: Objective[];
  secrets?: Secret[];
  sites?: SimSite[];
  challenges?: SiteChallenge[];
  desktopItems?: DesktopItem[];
  startMenuItems?: StartMenuItem[];
  /** Preflight fails if any of these is not registered on the client. */
  requiresApps?: AppId[];
}
