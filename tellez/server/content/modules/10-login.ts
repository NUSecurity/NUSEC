/**
 * Getting in.
 *
 * The clue is not on this machine. Alec's old posts in the real NUSEC Discord
 * are the source — how he signed off, and what he called himself — which makes
 * the first move of the investigation genuine OSINT against the club's own
 * history rather than anything we had to build.
 *
 * Note this module ships no files at all. A module is free to be nothing but
 * credentials and objectives; the engine does not care.
 */

import { MACHINE, type ContentModule } from "../kit.js";

export const login: ContentModule = {
  id: "login",
  title: "Getting in",
  summary:
    "Find Alec's username and password in his old Discord messages and unlock " +
    "the machine. Nothing else in the investigation opens until this does.",

  secrets: [
    // hints[0] of whichever half failed is shown on the lock screen after a
    // wrong attempt. The rest are for the facilitator to release by hand.
    {
      id: "machine-username",
      value: "ultimateguitar",
      hints: [
        "An ultimate instrument?",
        "He never used his real name as a handle — it is where a guitarist goes for tabs.",
      ],
    },
    {
      id: "machine-password",
      value: "hellohackers",
      hints: [
        "A legendary greeting.",
        "He opened every announcement the same way. Two words, no spaces.",
      ],
    },
  ],

  objectives: [
    {
      id: MACHINE.unlockedObjective,
      title: "Unlocked the machine",
      note: "They are in. Everything else in the investigation is behind this.",
      trigger: { on: "secret", id: "machine-password" },
    },
  ],
};
