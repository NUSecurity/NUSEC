import { APP_IDS, type KnownAppId } from "#shared/apps";
import type { NodeKind } from "#shared/protocol";
import type { DesktopApp } from "./types";

import { archive } from "./ArchiveViewer";
import { authenticator } from "./Authenticator";
import { browser } from "./Browser";
import { cipherBench } from "./CipherBench";
import { explorer } from "./FileExplorer";
import { hex } from "./HexViewer";
import { mail } from "./MailClient";
import { media } from "./MediaPlayer";
import { messenger } from "./Messenger";
import { notepad } from "./Notepad";
import { photos } from "./PhotoViewer";
import { recycleBin } from "./RecycleBin";
import { sheets } from "./SheetViewer";
import { shortcut } from "./ShortcutView";

/**
 * Every app, keyed by id.
 *
 * Adding one is a new file plus a line here plus its id in `shared/apps.ts`.
 * The `Record<KnownAppId, ...>` type is what makes a half-registered app a
 * compile error rather than a blank window during a meeting.
 */
const registry: Record<KnownAppId, DesktopApp> = {
  explorer, notepad, sheets, mail, messenger, photos,
  media, archive, shortcut, hex, browser,
  "recycle-bin": recycleBin,
  "cipher-bench": cipherBench,
  authenticator,
};

export const appById = (id: string): DesktopApp | undefined =>
  registry[id as KnownAppId];

export const allApps = (): DesktopApp[] => APP_IDS.map((id) => registry[id]);

/** Fallback when a node's `opensWith` is missing — should never happen; preflight checks it. */
export function appForKind(kind: NodeKind): DesktopApp | undefined {
  return allApps().find((app) => app.opens.includes(kind));
}
