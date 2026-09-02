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
  /** Path served from `public/` */
  href: string;
  kind: "download" | "link";
}

export interface Challenge {
  /** URL segment: /challenges/<meeting>/<slug>. */
  slug: string;
  title: string;
  category: ChallengeCategory;
  /** The brief, rendered as a single paragraph. */
  brief: string;
  assets?: ChallengeAsset[];
}

export interface Meeting {
  /** URL segment: /challenges/<slug>. */
  slug: string;
  title: string;
  active: boolean;
  challenges: Challenge[];
}
