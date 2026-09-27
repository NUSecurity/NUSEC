/**
 * The app id contract.
 *
 * Both sides check against this list: the client registry must provide every
 * id here, and server-side preflight validates that every node kind resolves
 * to one. Adding an app means adding its id here first — which is the step
 * that makes a missing viewer a build error instead of a blank window during
 * a meeting.
 */

export const APP_IDS = [
  "explorer",
  "notepad",
  "sheets",
  "mail",
  "messenger",
  "photos",
  "media",
  "archive",
  "shortcut",
  "hex",
  "browser",
  "recycle-bin",
  "cipher-bench",
] as const;

export type KnownAppId = (typeof APP_IDS)[number];

export const isKnownApp = (id: string): id is KnownAppId =>
  (APP_IDS as readonly string[]).includes(id);
