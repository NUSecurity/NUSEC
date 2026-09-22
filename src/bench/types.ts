/**
 * The Career Bench tile schema.
 *
 * Architecture v2 specifies flat YAML validated by CI. This repo has no CI and
 * already stores its content as typed modules, so the tiles are TS object
 * literals and `npm run typecheck` is the validator: a malformed tile fails the
 * build, and — the part YAML could not have done — every declared edge is a
 * union of real tile IDs, so a Pattern that demands a skill which does not
 * exist is a compile error rather than a broken link discovered in the room.
 *
 * One file per tile type under ./tiles. Adding a target is two lines in
 * tiles/targets.ts and nothing else.
 */

/* ------------------------------------------------------------------ *
 * Shared vocabulary
 * ------------------------------------------------------------------ */

/**
 * What kind of thing a target *is*. Patterns declare which classes they accept,
 * which is what makes "tear down a vulnerable web app" unreachable in the
 * composer rather than merely discouraged.
 */
export type TargetClass =
  | "physical-device"
  | "embedded"
  | "firmware-image"
  | "binary"
  | "web-app"
  | "network-service"
  | "cloud-env"
  | "protocol"
  | "dataset"
  | "process";

export const targetClassLabels: Record<TargetClass, string> = {
  "physical-device": "Physical device",
  embedded: "Embedded",
  "firmware-image": "Firmware image",
  binary: "Binary",
  "web-app": "Web app",
  "network-service": "Network service",
  "cloud-env": "Cloud environment",
  protocol: "Protocol",
  dataset: "Dataset",
  process: "Process",
};

/**
 * Who says you may touch this. The first three a student satisfies alone; the
 * last two need someone else's word, which the composer makes them attest to
 * before the bench will resolve.
 */
export type Authorization =
  | "owned"
  | "deliberately-vulnerable"
  | "public"
  | "team-authorized"
  | "scoped-program";

export const authorizationLabels: Record<Authorization, string> = {
  owned: "You own it",
  "deliberately-vulnerable": "Built to be attacked",
  public: "Public material",
  "team-authorized": "Needs your team lead's sign-off",
  "scoped-program": "Needs a program's scope",
};

/** Authorizations a student can satisfy without anyone else's permission. */
export const selfSatisfiable: Authorization[] = [
  "owned",
  "deliberately-vulnerable",
  "public",
];

/**
 * The attestation a student must tick for the two authorizations they cannot
 * satisfy alone. Until it is ticked the composer hard-blocks — one of only two
 * hard blocks in the tool.
 */
export const authorizationAttestation: Partial<Record<Authorization, string>> = {
  "team-authorized":
    "I have the sign-off of the team that owns this, from the person who can actually give it.",
  "scoped-program":
    "I have read this program's scope page, and I understand its rules beat anything this tool says.",
};

/** Rough size, used only by the advisory single-term check. */
export type Effort = 1 | 2 | 3;

export const effortLabels: Record<Effort, string> = {
  1: "A few evenings",
  2: "A few weeks",
  3: "Most of a term",
};

/* ------------------------------------------------------------------ *
 * Tile IDs
 *
 * Listed as unions rather than bare strings so that every edge declared
 * anywhere in ./tiles is checked against the tiles that actually exist.
 * ------------------------------------------------------------------ */

export type PatternId =
  | "PAT-TEARDOWN"
  | "PAT-FIRMWARE"
  | "PAT-BREAK"
  | "PAT-HARDEN"
  | "PAT-INSTRUMENT"
  | "PAT-REIMPLEMENT"
  | "PAT-AUTOMATE"
  | "PAT-SIMULATE"
  | "PAT-BRIDGE"
  | "PAT-MEASURE"
  | "PAT-AUDIT"
  | "PAT-DOCUMENT"
  | "PAT-DETECT"
  | "PAT-COMPARE"
  | "PAT-RECOVER"
  | "PAT-VISUALIZE"
  | "PAT-PORT";

export type TargetId =
  | "TGT-IPCAM"
  | "TGT-SMARTPLUG"
  | "TGT-ROUTER"
  | "TGT-KEYFOB"
  | "TGT-BADGE"
  | "TGT-OBD"
  | "TGT-DEVBOARD"
  | "TGT-FWIMAGE"
  | "TGT-CRACKME"
  | "TGT-SAVEFILE"
  | "TGT-VULNWEB"
  | "TGT-BOOT2ROOT"
  | "TGT-HOMENET"
  | "TGT-SELFHOST"
  | "TGT-CLOUDACCT"
  | "TGT-K8S"
  | "TGT-OSSREPO"
  | "TGT-PUBDATA"
  | "TGT-PROTOSPEC"
  | "TGT-CLUBPROC"
  | "TGT-BOUNTY"
  | "TGT-WEBAPP"
  | "TGT-APISVC"
  | "TGT-ADLAB"
  | "TGT-CONTAINER"
  | "TGT-CIPIPELINE"
  | "TGT-MEMIMAGE"
  | "TGT-LOGSET"
  | "TGT-MALSAMPLE";

export type ArtifactId =
  | "ART-REPO"
  | "ART-WRITEUP"
  | "ART-TOOL"
  | "ART-VIDEO"
  | "ART-DISCLOSURE"
  | "ART-DATASET"
  | "ART-REFBUILD"
  | "ART-THREATMODEL"
  | "ART-TEACHING";

export type KitId =
  | "KIT-HOMELAB"
  | "KIT-HWBENCH"
  | "KIT-FLASHDUMP"
  | "KIT-SDR"
  | "KIT-CLOUDACCT"
  | "KIT-MALVM";

export type DomainId =
  | "DOM-RE"
  | "DOM-HW"
  | "DOM-OFFSEC"
  | "DOM-DFIR"
  | "DOM-CLOUD"
  | "DOM-LINUX"
  | "DOM-NETWORK"
  | "DOM-APPSEC";

export type SkillId =
  // DOM-RE
  | "SKL-RE-DISASM"
  | "SKL-RE-GHIDRA"
  | "SKL-RE-ANTIANALYSIS"
  | "SKL-RE-FORMAT"
  // DOM-HW
  | "SKL-HW-UART"
  | "SKL-HW-FLASH"
  | "SKL-HW-DATASHEET"
  | "SKL-HW-LOGIC"
  // DOM-OFFSEC
  | "SKL-OFFSEC-ENUM"
  | "SKL-OFFSEC-WEB"
  | "SKL-OFFSEC-PRIVESC"
  | "SKL-OFFSEC-FINDING"
  // DOM-DFIR
  | "SKL-DFIR-ACQUIRE"
  | "SKL-DFIR-TIMELINE"
  | "SKL-DFIR-MEMORY"
  | "SKL-DFIR-TRIAGE"
  // DOM-CLOUD
  | "SKL-CLOUD-IAM"
  | "SKL-CLOUD-BASELINE"
  | "SKL-CLOUD-METADATA"
  // DOM-LINUX
  | "SKL-LINUX-SHELL"
  | "SKL-LINUX-SYSTEMD"
  | "SKL-LINUX-TRACE"
  | "SKL-LINUX-BUILD"
  // DOM-NETWORK
  | "SKL-NET-CAPTURE"
  | "SKL-NET-TLS"
  | "SKL-NET-SEGMENT"
  // DOM-APPSEC
  | "SKL-APPSEC-THREATMODEL"
  | "SKL-APPSEC-CODEREVIEW"
  | "SKL-APPSEC-FUZZ";

export type ProveId =
  // Tier 1
  | "PRV-PR"
  | "PRV-BUGREPORT"
  | "PRV-REVIEWEDPOST"
  | "PRV-CTFWRITEUP"
  | "PRV-TEACH"
  | "PRV-WIKI"
  | "PRV-TRANSLATE"
  // Tier 2
  | "PRV-BSIDES"
  | "PRV-VILLAGE"
  | "PRV-MEETUP"
  | "PRV-NCL"
  | "PRV-CPTC"
  | "PRV-ECTF"
  | "PRV-CCDC"
  | "PRV-POSTER"
  | "PRV-COHORT"
  // Tier 3
  | "PRV-SECPLUS"
  | "PRV-EJPT"
  | "PRV-OSCP"
  | "PRV-GCIH"
  | "PRV-GCFA"
  | "PRV-CLOUDSEC"
  | "PRV-RA"
  | "PRV-PAPER"
  | "PRV-COOP";

/* ------------------------------------------------------------------ *
 * The base every tile shares
 * ------------------------------------------------------------------ */

/**
 * `first_move` and `failure_mode` do the most work in the whole spec. Student
 * plans die because step one was never concrete and because the common failure
 * was never named, so both are required on every tile regardless of type.
 */
/**
 * An outbound link attached to a tile — the official page for a certification,
 * where to get a target, the protocol spec. Separate from Resource: these are
 * "go here to do this thing", not a curated learning path, so they aren't
 * slot-capped or pooled.
 */
export interface TileLink {
  title: string;
  url: string;
  last_verified: string | null;
}

/**
 * What the tile's full-screen view shows.
 *
 * The card is deliberately small — a name and a line of context — because a
 * grid of paragraphs is unreadable. Everything that used to be crammed onto
 * the card lives here instead, along with the depth there was never room for:
 * what the thing looks like in different settings, and concrete examples.
 * Nothing is lost by shrinking the card; there is more here than there was.
 */
export interface TileDetail {
  /** Paragraphs expanding the brief. */
  overview: string[];
  /** The same idea in different settings — audit a network vs audit firmware. */
  contexts?: { label: string; body: string }[];
  /** Concrete things someone could actually go and do. */
  examples?: string[];
}

export interface TileBase {
  name: string;
  /** 2–3 sentences, plain language, no jargon the tile itself teaches. */
  brief: string;
  /** The smallest physical action that starts this. Never "research X". */
  first_move: string;
  /** How people actually lose here. Shown as "common pitfalls". */
  failure_mode: string;
  /** The full-screen view. */
  detail: TileDetail;
}

export const resourceTypeCaps: Record<ResourceType, number> = {
  foundation: 2,
  "hands-on": 4,
  reference: 3,
  corpus: 4,
  community: 2,
};

export const resourceTypeMeanings: Record<ResourceType, string> = {
  foundation: "The one book or course",
  "hands-on": "Where you practice",
  reference: "What stays open while working",
  corpus: "Real material to work on",
  community: "Where you ask when stuck",
};

export type ResourceType =
  | "foundation"
  | "hands-on"
  | "reference"
  | "corpus"
  | "community";

export const resourceTypeLabels: Record<ResourceType, string> = {
  foundation: "Foundation",
  "hands-on": "Hands-on",
  reference: "Reference",
  corpus: "Corpus",
  community: "Community",
};

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  /** Why this one and not another. One sentence. */
  note: string;
  /**
   * ISO date the link was last opened and confirmed to be what we claim.
   * `null` renders as unverified. Past twelve months renders greyed with a
   * "verify this" link, so decay is visible and distributed.
   */
  last_verified: string | null;
  /** Costs money. Shown so nobody clicks into a paywall unwarned. */
  paid?: boolean;
}

/* ------------------------------------------------------------------ *
 * Project field
 * ------------------------------------------------------------------ */

export interface Pattern extends TileBase {
  id: PatternId;
  /** The verb as it appears in the sentence, e.g. "Tear down". */
  verb: string;
  /**
   * Target classes this verb is commonly applied to. A hint, not a gate — the
   * composer marks these as common pairings and lets you pick anything.
   * Hardening a badge and tearing down a process are both real projects, and a
   * taxonomy that forbids them is wrong rather than strict.
   */
  accepts: TargetClass[];
  /** Artifacts this pattern usually ends in. Also a hint — any artifact goes. */
  yields: ArtifactId[];
  /**
   * The few skills this pattern will genuinely force you to use. Deliberately
   * short — it's the headline, not the full set.
   *
   * `demands` and Skill.exercised_by are related but not inverses: a pattern
   * exercises far more skills than it demands. The invariant that does hold is
   * one-way — anything a pattern demands must list that pattern as exercising
   * it. validateTiles enforces that direction and only that direction.
   */
  demands: SkillId[];
  effort: Effort;
  /** How to actually do this pattern. Same slot rules as a domain pool. */
  resources: Resource[];
}

export interface Target extends TileBase {
  id: TargetId;
  /** How it reads in the sentence, e.g. "a $20 IP camera". */
  phrase: string;
  classes: TargetClass[];
  cost: string;
  sourcing: string;
  gotchas: string;
  requires_kits: KitId[];
  authorization: Authorization;
  effort: Effort;
  /** Where to get one, or the spec. */
  links?: TileLink[];
}

export interface Artifact extends TileBase {
  id: ArtifactId;
  /** How it reads in the sentence, e.g. "a technical writeup". */
  phrase: string;
}

export interface Kit extends TileBase {
  id: KitId;
  cost: string;
}

/* ------------------------------------------------------------------ *
 * Skill field
 * ------------------------------------------------------------------ */

export type Rung = "recognize" | "use" | "build" | "teach";

/** Bottom to top. Index order is load-bearing — a bench moves up exactly one. */
export const rungOrder: Rung[] = ["recognize", "use", "build", "teach"];

export const rungLabels: Record<Rung, string> = {
  recognize: "Recognize",
  use: "Use",
  build: "Build",
  teach: "Teach",
};

export const rungMeanings: Record<Rung, string> = {
  recognize: "You know it when you see it",
  use: "You can do it with references open",
  build: "You can make something new with it",
  teach: "You can get someone else to Use",
};

/**
 * Resource slots. Each type is capped, because twenty flat links is a list
 * nobody reads and five slots with defined roles is a path. The cap is the
 * service being provided.
 */




export interface Domain extends TileBase {
  id: DomainId;
  /**
   * Deep domains ship curated pools. Stubbed domains say so and show how to
   * contribute — a half-built tool that admits it is credible, one that
   * pretends to cover eight domains and delivers three links each is not.
   */
  depth: "deep" | "stub";
  /** Pooled at the domain: ~18 entries serving all of its skills. */
  resources: Resource[];
}

export interface Skill extends TileBase {
  id: SkillId;
  domain: DomainId;
  /**
   * The test for each rung, phrased as something you did or didn't do. Never a
   * self-rating: students overrate themselves on sliders and underrate
   * themselves on checkboxes, and the checkbox version produces an honest plan.
   */
  rungs: Record<Rung, string>;
  /**
   * Every pattern that gives you practice at this skill — wider than the set
   * of patterns that *demand* it. See Pattern.demands.
   */
  exercised_by: PatternId[];
  /** Only what is unique to this skill. The bulk is pooled at the domain. */
  resources: Resource[];
}

/* ------------------------------------------------------------------ *
 * Prove field
 * ------------------------------------------------------------------ */

/** Tier 0 exists to be named and excluded. The Prove slot requires 1 or above. */
export type Tier = 0 | 1 | 2 | 3;

export const tierLabels: Record<Tier, string> = {
  0: "No gate",
  1: "Community review",
  2: "Competitive selection",
  3: "Formal credential",
};

export const tierExamples: Record<Tier, string> = {
  0: "Your own blog, your own repo, a LinkedIn post",
  1: "Merged PR, accepted bug report, editorially reviewed club post",
  2: "CFP accepted, competition placement, selected for a cohort",
  3: "Certification passed, paper published, funded research, offer signed",
};

/**
 * Project and Skill run on the student's clock. Prove runs on someone else's,
 * which is why these tiles carry window data the others don't need.
 */
export type WindowType =
  | "recurring-cfp"
  | "annual"
  | "rolling"
  | "seasonal"
  | "club-run";

export const windowTypeLabels: Record<WindowType, string> = {
  "recurring-cfp": "Recurring CFP",
  annual: "Once a year",
  rolling: "Open whenever you are",
  seasonal: "Seasonal hiring or registration",
  "club-run": "Run by NUSEC",
};

export interface ProveTile extends TileBase {
  id: ProveId;
  /**
   * How it reads mid-sentence: "I am going for <phrase>". Tile names are noun
   * phrases written for a list, and dropping one into a sentence produced
   * things like "putting a writeup through Merged PR to a project you don't
   * own". The sentence gets its own wording.
   */
  phrase: string;
  tier: 1 | 2 | 3;
  /** Named so the sorting question answers itself: who could have rejected this? */
  gatekeeper: string;
  consumes_artifacts: ArtifactId[];
  window: { type: WindowType; note: string };
  /** Human text, plus months for the advisory horizon check. */
  lead_time: string;
  lead_time_months: number;
  cost: string;
  /** The official page — registration, syllabus, CFP. */
  links?: TileLink[];
}

/* ------------------------------------------------------------------ *
 * A composed bench
 * ------------------------------------------------------------------ */

export interface BenchState {
  pattern: PatternId | null;
  target: TargetId | null;
  artifact: ArtifactId | null;
  skill: SkillId | null;
  /** Where the checkbox tests say they are now. */
  from: Rung | null;
  /** Where this bench moves them. Always exactly one rung above `from`. */
  to: Rung | null;
  prove: ProveId | null;
  /** Kits the student ticked as already owning. Drives the advisory check. */
  kits: KitId[];
  /** Ticked attestation for a target that needs someone else's word. */
  authorized: boolean;
}

/**
 * The planning horizon the lead-time check measures against. Fixed at one
 * term rather than offered as a control: a term is the unit a student actually
 * plans in, and a toggle that only changed one advisory line read as a knob
 * that did nothing.
 */
export const TERM_MONTHS = 4;

export interface Preset {
  slug: string;
  title: string;
  /** Who this is for, in one line. Shown on the card. */
  who: string;
  bench: Pick<
    BenchState,
    "pattern" | "target" | "artifact" | "skill" | "from" | "to" | "prove"
  >;
}
