/**
 * Types for the mini-CTF that runs alongside general meetings.
 *
 * Everything on the /challenges/* pages is driven by the meeting manifests in
 * `src/ctf/meetings/`. Adding a new meeting means adding one manifest file and
 * registering it in `src/ctf/meetings/index.ts` — no page or route changes.
 */

export type ChallengeCategory =
  | "web"
  | "forensics"
  | "network"
  | "crypto"
  | "osint"
  | "reversing"
  | "misc";

export type ChallengeDifficulty = "easy" | "medium" | "hard";

/** A file to download or a live page to visit as part of a challenge. */
export interface ChallengeAsset {
  label: string;
  /** Path served from `public/`, e.g. "/ctf/gm-1/capture.pcapng". */
  href: string;
  kind: "download" | "link";
  /** Optional note shown next to the asset, e.g. "open in Wireshark". */
  note?: string;
}

export interface Challenge {
  /** URL segment: /challenges/<meeting>/<slug>. */
  slug: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  /** One-liner shown on the meeting index card. */
  tagline: string;
  /** Full brief. Each string renders as its own paragraph. */
  brief: string[];
  assets?: ChallengeAsset[];
  /** Revealed one at a time, in order, when the solver asks for help. */
  hints?: string[];
  /** Shown above the flag input so people know what shape to look for. */
  flagFormat: string;
}

export interface Meeting {
  /** URL segment: /challenges/<slug>. */
  slug: string;
  title: string;
  subtitle?: string;
  /** ISO date (YYYY-MM-DD) of the meeting. */
  date: string;
  /** Intro paragraphs shown above the challenge list. */
  intro?: string[];
  /**
   * Set to false to close a meeting without deleting it — the page still
   * resolves but is marked archived and flags are no longer accepted.
   */
  active?: boolean;
  challenges: Challenge[];
}
