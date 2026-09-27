/**
 * Everything the shell needs once the machine is unlocked: the desktop icons,
 * the Start menu, and who the machine belongs to.
 *
 * Deliberately no objective data. Players are never told what they have found
 * or what is left — those markers exist for the facilitator board alone — and
 * that has to hold in the network tab, not just on screen.
 */

import { MACHINE } from "../server/content/machine.js";
import { world } from "../server/engine.js";
import { requireMachine } from "../server/guard.js";
import type { ApiRequest, ApiResponse } from "../server/http.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const ctx = await requireMachine(req, res);
  if (!ctx) return;

  res.status(200).json({
    machine: {
      osName: MACHINE.osName,
      osVersion: MACHINE.osVersion,
      hostname: MACHINE.hostname,
      user: MACHINE.user,
      fullName: MACHINE.fullName,
      role: MACHINE.role,
      imagedAt: MACHINE.imagedAt,
    },
    desktopItems: world().desktopItems(),
    startMenuItems: world().startMenuItems(),
  });
}
