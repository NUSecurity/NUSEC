/**
 * Types for the mini-CTF that runs alongside general meetings.
 *
 * Everything on the /challenges/* pages is driven by the meeting manifests in
 * `src/ctf/meetings/`. Adding a new meeting means adding one manifest file and
 * registering it in `src/ctf/meetings/index.ts` — no page or route changes.
 */

/**
 * Every flag we hand out looks like this. Shown as the flag input's
 * placeholder; if a future meeting ever needs a different shape, this becomes a
 * per-challenge field again.
 */
export const FLAG_FORMAT = "NUSEC{...}";

/** Groups challenges under a heading on the meeting menu. */
export type ChallengeCategory =
  | "web"
  | "forensics"
  | "network"
  | "crypto"
  | "osint"
  | "reversing"
  | "misc";

/** Heading text for each category, shown only on the menu page. */
export const categoryLabels: Record<ChallengeCategory, string> = {
  web: "Web",
  forensics: "Forensics",
  network: "Network",
  crypto: "Crypto",
  osint: "OSINT",
  reversing: "Reversing",
  misc: "Misc",
};

/** A file to download or a live page to visit as part of a challenge. */
export interface ChallengeAsset {
  label: string;
  /** Path served from `public/`, e.g. "/ctf/mini-ctf/capture.pcapng". */
  href: string;
  kind: "download" | "link";
}

export interface Challenge {
  /** URL segment: /challenges/<meeting>/<slug>. */
  slug: string;
  title: string;
  category: ChallengeCategory;
  /** The brief. Each string renders as its own paragraph. */
  brief: string[];
  assets?: ChallengeAsset[];
}

export interface Meeting {
  /** URL segment: /challenges/<slug>. */
  slug: string;
  title: string;
  /**
   * Set to false to close a meeting without deleting it — the page still
   * resolves but flags are no longer accepted.
   */
  active?: boolean;
  challenges: Challenge[];
}
