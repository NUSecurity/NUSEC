/**
 * Getting in.
 *
 * The username is just his account name. The password is not on this machine:
 * it is the handle he used in his old posts in the real NUSEC Discord, which
 * makes the first move of the investigation genuine OSINT against the club's
 * own history rather than anything we had to build.
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
    // wrong attempt. The two hints differ, so which one appears still tells a
    // player whether the username half was right.
    {
      id: "machine-username",
      value: "atellez",
      hints: ["First initial + last name, e.g. jsmith for John Smith"],
    },
    {
      id: "machine-password",
      value: "ultimateguitar",
      hints: ["Discord username"],
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
