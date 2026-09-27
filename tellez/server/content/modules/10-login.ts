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

import { MACHINE, type ContentModule } from "../kit.ts";

export const login: ContentModule = {
  id: "login",
  title: "Getting in",
  summary:
    "Find Alec's username and password in his old Discord messages and unlock " +
    "the machine. Nothing else in the investigation opens until this does.",

  secrets: [
    {
      id: "machine-username",
      value: "ultimateguitar",
      hints: [
        "He never used his real name as a handle.",
        "It is where a guitarist goes for tabs.",
      ],
    },
    {
      id: "machine-password",
      value: "hellohackers",
      hints: [
        "He opened every single announcement the same way.",
        "Two words, no spaces, exactly how he greeted the server.",
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
