/**
 * Facts about the machine itself, shared by the content and the engine.
 *
 * `unlockedObjective` is the one objective id the engine knows by name: every
 * filesystem and web request refuses until a session has it, so the lock screen
 * is a real gate rather than a client-side curtain. Everything else about the
 * investigation is data.
 */

export const MACHINE = {
  osName: "HuskyOS",
  osVersion: "11",
  hostname: "NUSEC-PRES-01",
  user: "atellez",
  fullName: "Alec Tellez",
  role: "President (former)",
  /** Seized image timestamp, shown on the lock screen and in file properties. */
  imagedAt: Date.UTC(2026, 8, 22, 14, 3),
  unlockedObjective: "desktop-unlocked",
} as const;
