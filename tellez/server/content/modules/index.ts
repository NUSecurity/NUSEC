/**
 * The module registry.
 *
 * Add your module here and it is live. Order is irrelevant — the world merges
 * every module into one machine and a dependency graph of objectives decides
 * what opens what. The numeric filename prefixes are for human scanning only;
 * nothing reads them.
 */

import type { ContentModule } from "../../types.ts";
import { workstation } from "./00-workstation.ts";
import { login } from "./10-login.ts";
import { recycleBin } from "./20-recycle-bin.ts";
import { desktopNotes } from "./30-desktop-notes.ts";
import { brightline } from "./40-brightline.ts";

export const modules: ContentModule[] = [
  workstation,
  login,
  recycleBin,
  desktopNotes,
  brightline,
];
