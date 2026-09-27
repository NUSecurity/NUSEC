/**
 * Everything the shell needs once the machine is unlocked: the desktop icons,
 * the Start menu, who the machine belongs to, and the catalogue of visible
 * objective titles.
 *
 * The catalogue is titles only, and hidden objectives are withheld entirely —
 * it exists so a discovery can be acknowledged by name in a toast, not so a
 * player can read a checklist of what they have not found yet.
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
    catalogue: world()
      .allObjectives()
      .filter((objective) => !objective.hidden)
      .map((objective) => ({ id: objective.id, title: objective.title })),
  });
}
