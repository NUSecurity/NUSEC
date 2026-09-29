/**
 * The module registry.
 *
 * Add your module here and it is live. Order is irrelevant — the world merges
 * every module into one machine and a dependency graph of objectives decides
 * what opens what. The numeric filename prefixes are for human scanning only;
 * nothing reads them.
 */

import type { ContentModule } from "../../types.js";
import { workstation } from "./00-workstation.js";
import { login } from "./10-login.js";
import { recycleBin } from "./20-recycle-bin.js";
import { desktopNotes } from "./30-desktop-notes.js";
import { brightline } from "./40-brightline.js";
import { classified } from "./50-classified.js";

export const modules: ContentModule[] = [
  workstation,
  login,
  recycleBin,
  desktopNotes,
  brightline,
  classified,
];
