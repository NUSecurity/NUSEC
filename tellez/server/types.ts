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
  desktopItems?: DesktopItem[];
  startMenuItems?: StartMenuItem[];
  /** Preflight fails if any of these is not registered on the client. */
  requiresApps?: AppId[];
}
