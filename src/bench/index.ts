import patterns from "./tiles/patterns";
import targets from "./tiles/targets";
import artifacts from "./tiles/artifacts";
import kits from "./tiles/kits";
import domains from "./tiles/domains";
import skills from "./tiles/skills";
import proveTiles from "./tiles/prove";
import presets from "./tiles/presets";
import {
  ArtifactId,
  DomainId,
  KitId,
  PatternId,
  ProveId,
  Resource,
  SkillId,
  TargetId,
  resourceTypeCaps,
} from "./types";

export {
  patterns,
  targets,
  artifacts,
  kits,
  domains,
  skills,
  proveTiles,
  presets,
};

/* ------------------------------------------------------------------ *
 * Lookups
 *
 * Indexed by ID once at module load. The `!` is safe because the ID types
 * are unions of exactly the tiles below — a typo is a compile error, not a
 * lookup returning undefined at runtime.
 * ------------------------------------------------------------------ */

const byId = <T extends { id: string }>(tiles: T[]) =>
  new Map(tiles.map((tile) => [tile.id, tile]));

const patternMap = byId(patterns);
const targetMap = byId(targets);
const artifactMap = byId(artifacts);
const kitMap = byId(kits);
const domainMap = byId(domains);
const skillMap = byId(skills);
const proveMap = byId(proveTiles);

export const getPattern = (id: PatternId) => patternMap.get(id)!;
export const getTarget = (id: TargetId) => targetMap.get(id)!;
export const getArtifact = (id: ArtifactId) => artifactMap.get(id)!;
export const getKit = (id: KitId) => kitMap.get(id)!;
export const getDomain = (id: DomainId) => domainMap.get(id)!;
export const getSkill = (id: SkillId) => skillMap.get(id)!;
export const getProve = (id: ProveId) => proveMap.get(id)!;

/** Every ID that exists, for decoding untrusted URL state. */
export const isPatternId = (v: string): v is PatternId => patternMap.has(v);
export const isTargetId = (v: string): v is TargetId => targetMap.has(v);
export const isArtifactId = (v: string): v is ArtifactId => artifactMap.has(v);
export const isKitId = (v: string): v is KitId => kitMap.has(v);
export const isSkillId = (v: string): v is SkillId => skillMap.has(v);
export const isProveId = (v: string): v is ProveId => proveMap.has(v);

/** Skills grouped by domain, in domain order, for the picker. */
export const skillsByDomain = domains.map((domain) => ({
  domain,
  skills: skills.filter((skill) => skill.domain === domain.id),
}));

/**
 * The resources a student sees for one skill: the domain's pool plus whatever
 * is specific to the skill. Pooling is why this list stays maintainable.
 */
export function resourcesFor(id: SkillId): Resource[] {
  const skill = getSkill(id);
  return [...getDomain(skill.domain).resources, ...skill.resources];
}

/** Twelve months from `now`, after which a resource renders as stale. */
export function resourceAge(
  resource: Resource,
  now = new Date(),
): "verified" | "stale" | "unverified" {
  if (!resource.last_verified) return "unverified";
  const verified = new Date(resource.last_verified);
  if (Number.isNaN(verified.getTime())) return "unverified";
  const twelveMonths = new Date(verified);
  twelveMonths.setMonth(twelveMonths.getMonth() + 12);
  return now > twelveMonths ? "stale" : "verified";
}

/* ------------------------------------------------------------------ *
 * Link-graph validation
 *
 * TypeScript already proves every edge points at a tile that exists. What it
 * can't prove is the rest: duplicate IDs, a slot cap blown, a pattern with no
 * legal target, a skill nothing exercises. Those run in dev and shout in the
 * console, so a bad tile is caught by whoever added it rather than by a student
 * in a meeting.
 * ------------------------------------------------------------------ */

export function validateTiles(): string[] {
  const problems: string[] = [];

  const duplicates = <T extends { id: string }>(tiles: T[], label: string) => {
    const seen = new Set<string>();
    for (const tile of tiles) {
      if (seen.has(tile.id)) problems.push(`${label}: duplicate id ${tile.id}`);
      seen.add(tile.id);
    }
  };

  duplicates(patterns, "patterns");
  duplicates(targets, "targets");
  duplicates(artifacts, "artifacts");
  duplicates(kits, "kits");
  duplicates(domains, "domains");
  duplicates(skills, "skills");
  duplicates(proveTiles, "prove");

  // Every pattern must have somewhere to point. A pattern whose accepted
  // classes match no target is unreachable in the composer.
  for (const pattern of patterns) {
    const reachable = targets.filter((target) =>
      target.classes.some((cls) => pattern.accepts.includes(cls)),
    );
    if (reachable.length === 0) {
      problems.push(`${pattern.id}: accepts no class any target carries`);
    }
    if (pattern.yields.length === 0) {
      problems.push(`${pattern.id}: yields no artifact`);
    }
  }

  // A skill nothing exercises can never be highlighted from a project, which
  // silently breaks half the linking UI for that skill.
  for (const skill of skills) {
    if (skill.exercised_by.length === 0) {
      problems.push(`${skill.id}: no pattern exercises it`);
    }
  }

  // The one-way invariant between the two skill edges: a pattern that demands
  // a skill must appear in that skill's exercised_by. The reverse is expected
  // to be wider — plenty of patterns exercise a skill without demanding it —
  // so asserting the inverse would flag correct data.
  for (const pattern of patterns) {
    for (const skillId of pattern.demands) {
      if (!getSkill(skillId).exercised_by.includes(pattern.id)) {
        problems.push(
          `${pattern.id}: demands ${skillId}, which doesn't list it in exercised_by`,
        );
      }
    }
  }

  // Slot caps. The cap is the service being provided; blowing it silently
  // turns a curated path back into a list nobody reads.
  const checkCaps = (resources: Resource[], label: string) => {
    const counts = new Map<string, number>();
    for (const resource of resources) {
      counts.set(resource.type, (counts.get(resource.type) ?? 0) + 1);
    }
    for (const [type, count] of counts) {
      const cap = resourceTypeCaps[type as Resource["type"]];
      if (count > cap) {
        problems.push(`${label}: ${count} ${type} resources exceeds cap of ${cap}`);
      }
    }
  };

  for (const domain of domains) {
    checkCaps(domain.resources, domain.id);
    if (domain.depth === "deep" && domain.resources.length === 0) {
      problems.push(`${domain.id}: marked deep but has no resources`);
    }
    if (domain.depth === "stub" && domain.resources.length > 0) {
      problems.push(`${domain.id}: marked stub but ships resources`);
    }
  }

  // Presets must resolve, or the "decompose a worked example" teaching breaks.
  for (const preset of presets) {
    const { pattern, target, artifact } = preset.bench;
    if (!pattern || !target || !artifact) {
      problems.push(`preset ${preset.slug}: incomplete project`);
      continue;
    }
    const patternTile = getPattern(pattern);
    const targetTile = getTarget(target);
    if (!targetTile.classes.some((cls) => patternTile.accepts.includes(cls))) {
      problems.push(`preset ${preset.slug}: ${pattern} cannot accept ${target}`);
    }
    if (!patternTile.yields.includes(artifact)) {
      problems.push(`preset ${preset.slug}: ${pattern} does not yield ${artifact}`);
    }
  }

  return problems;
}

if (import.meta.env.DEV) {
  const problems = validateTiles();
  if (problems.length > 0) {
    console.error(
      `[career bench] ${problems.length} tile problem(s):\n` +
        problems.map((p) => `  • ${p}`).join("\n"),
    );
  }
}
