import { getArtifact, getKit, getPattern, getProve, getSkill, getTarget } from "@/bench";
import {
  BenchState,
  authorizationAttestation,
  horizonMonths,
  selfSatisfiable,
} from "@/bench/types";

/**
 * The seven coherence checks.
 *
 * Two hard blocks, five advisories. Everything else highlights and explains.
 *
 * The moment the tool blocks a combination on taste it becomes a form, and
 * students fill out forms resentfully. A greyed tile reading "this doesn't
 * obviously connect to your project — pick it anyway?" respects the student and
 * still teaches the lesson.
 */

export type CheckSeverity = "block" | "advisory";

export interface CheckResult {
  id: string;
  severity: CheckSeverity;
  /** Short line shown in the checks panel. */
  message: string;
  /** What to do about it, when there's something concrete to say. */
  detail?: string;
}

export function runChecks(state: BenchState): CheckResult[] {
  const results: CheckResult[] = [];

  /* 1 — Target authorization is satisfiable by the student alone. HARD BLOCK.
   *
   * A security club cannot ship a tool that composes "go and test a thing you
   * have no permission to test". Three of the five authorizations a student
   * satisfies alone; the other two need someone else's word, and the student
   * has to say they have it. */
  if (state.target) {
    const target = getTarget(state.target);
    const needsAttestation = !selfSatisfiable.includes(target.authorization);

    if (needsAttestation && !state.authorized) {
      results.push({
        id: "authorization",
        severity: "block",
        message: `${target.name} needs permission you can't give yourself.`,
        detail: authorizationAttestation[target.authorization],
      });
    }
  }

  /* 2 — Prove tile is Tier 1 or above. HARD BLOCK.
   *
   * Enforced structurally: Tier 0 has no tiles, so there is nothing to pick
   * that would fail. The check stays here because the rule is worth stating,
   * and because it would fire if someone ever added a Tier-0 tile. */
  if (state.prove && getProve(state.prove).tier < 1) {
    results.push({
      id: "tier",
      severity: "block",
      message: "Tier 0 isn't proof — it's the artifact your project already produced.",
      detail: "Pick something that could have said no to you.",
    });
  }

  /* 3 — Prove consumes the artifact the project yields. Advisory. */
  if (state.artifact && state.prove) {
    const prove = getProve(state.prove);
    const artifact = getArtifact(state.artifact);

    if (!prove.consumes_artifacts.includes(state.artifact)) {
      results.push({
        id: "artifact-join",
        severity: "advisory",
        message: `${prove.name} doesn't take ${artifact.phrase}.`,
        detail:
          "Allowed, but you're running two efforts rather than one. Know that going in.",
      });
    }
  }

  /* 4 — Project demands the chosen skill. Advisory.
   *
   * Reads both edges. A pattern demands a short headline set of skills but
   * exercises many more, and a student whose skill tile says "PAT-BREAK
   * exercises this" should not then be told the project won't touch it. */
  if (state.pattern && state.skill) {
    const pattern = getPattern(state.pattern);
    const skill = getSkill(state.skill);
    const touched =
      pattern.demands.includes(state.skill) ||
      skill.exercised_by.includes(state.pattern);

    if (!touched) {
      results.push({
        id: "skill-join",
        severity: "advisory",
        message: `${skill.name} isn't one this project will put you through.`,
        detail:
          "Fine if you want the practice separately — but the project won't carry you through it.",
      });
    }
  }

  /* 5 — Student has the required kits. Advisory, with cost and first move.
   *
   * Never blocks. Plenty of people buy the thing *because* they picked the
   * project. But "you need a $12 UART adapter before this starts" beats
   * discovering that three weeks in. */
  if (state.target) {
    const missing = getTarget(state.target).requires_kits.filter(
      (kit) => !state.kits.includes(kit),
    );

    for (const kitId of missing) {
      const kit = getKit(kitId);
      results.push({
        id: `kit-${kitId}`,
        severity: "advisory",
        message: `You'll need ${kit.name} first — ${kit.cost}.`,
        detail: kit.first_move,
      });
    }
  }

  /* 6 — Combined effort fits a single term. Advisory. */
  if (state.pattern && state.target) {
    const load = getPattern(state.pattern).effort + getTarget(state.target).effort;
    if (load >= 6) {
      results.push({
        id: "effort",
        severity: "advisory",
        message: "This is a heavy project on a heavy target.",
        detail:
          "Both halves are term-sized. Consider a smaller target, or accept that this is the whole semester.",
      });
    }
  }

  /* 7 — Prove lead time fits the horizon. Advisory. */
  if (state.prove) {
    const prove = getProve(state.prove);
    const available = horizonMonths[state.horizon];

    if (prove.lead_time_months > available) {
      results.push({
        id: "lead-time",
        severity: "advisory",
        message: `${prove.name} needs about ${prove.lead_time_months} months — longer than ${
          state.horizon === "term" ? "a term" : "a year"
        }.`,
        detail: prove.window.note,
      });
    }
  }

  return results;
}

/** A bench with an unsatisfied hard block can't be shared or printed. */
export const isBlocked = (results: CheckResult[]) =>
  results.some((result) => result.severity === "block");

/* ------------------------------------------------------------------ *
 * The closing sentence
 * ------------------------------------------------------------------ */

/**
 * One generated line at the end of a completed bench, naming whether the three
 * fields are one effort or several. This is where the disconnected bench gets
 * caught — not by a block, but by being said out loud.
 */
export function closingSentence(state: BenchState): string | null {
  if (!state.artifact || !state.prove) return null;

  const artifact = getArtifact(state.artifact);
  const prove = getProve(state.prove);
  const connected = prove.consumes_artifacts.includes(state.artifact);

  if (connected) {
    return `Your project produces ${artifact.phrase}. Your proof consumes ${artifact.phrase}. Those connect.`;
  }

  return `Your project produces ${artifact.phrase}. Your proof is ${prove.name.toLowerCase()}. Those don't connect — allowed, but you're running two efforts, not one. Know that going in.`;
}
