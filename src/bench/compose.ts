import {
  artifacts,
  getPattern,
  getTarget,
  patterns,
  targets,
} from "@/bench";
import { Artifact, BenchState, Pattern, Preset, Target } from "@/bench/types";

/**
 * Composition rules for the Project field.
 *
 * Targets carry classes; patterns declare which classes they accept. The
 * composer only offers valid combinations, so "tear down a vulnerable web app"
 * is unreachable rather than merely discouraged — the student never sees it as
 * an option and never has to be told no.
 *
 * Every function here answers "given what's picked so far, what's still legal",
 * and each returns the full list when nothing constrains it yet. Picking in any
 * order works: a student who knows the device but not the verb is as well
 * served as one who knows the verb.
 */

const sharesClass = (pattern: Pattern, target: Target) =>
  target.classes.some((cls) => pattern.accepts.includes(cls));

/** Patterns still legal given the target and artifact picked so far. */
export function availablePatterns(state: Partial<BenchState>): Pattern[] {
  return patterns.filter((pattern) => {
    if (state.target && !sharesClass(pattern, getTarget(state.target))) {
      return false;
    }
    if (state.artifact && !pattern.yields.includes(state.artifact)) return false;
    return true;
  });
}

/** Targets still legal given the pattern picked so far. */
export function availableTargets(state: Partial<BenchState>): Target[] {
  if (!state.pattern) return targets;
  const pattern = getPattern(state.pattern);
  return targets.filter((target) => sharesClass(pattern, target));
}

/** Artifacts still legal given the pattern picked so far. */
export function availableArtifacts(state: Partial<BenchState>): Artifact[] {
  if (!state.pattern) return artifacts;
  const pattern = getPattern(state.pattern);
  return artifacts.filter((artifact) => pattern.yields.includes(artifact.id));
}

/**
 * Clears picks that a new selection has made illegal.
 *
 * Changing the pattern can strand a target or artifact that no longer fits.
 * Silently dropping the stranded pick is better than blocking the change —
 * the student is exploring, and the tool's job is to let them.
 */
export function reconcile(state: BenchState): BenchState {
  if (!state.pattern) return state;

  const pattern = getPattern(state.pattern);
  const next = { ...state };

  if (next.target && !sharesClass(pattern, getTarget(next.target))) {
    next.target = null;
  }
  if (next.artifact && !pattern.yields.includes(next.artifact)) {
    next.artifact = null;
  }

  // A target the student can't authorize alone needs a fresh attestation
  // whenever the target changes — consent doesn't carry between targets.
  if (next.target !== state.target) next.authorized = false;

  return next;
}

/** True once all three Project tiles are chosen. */
export const projectComplete = (state: BenchState) =>
  Boolean(state.pattern && state.target && state.artifact);

/** True once every field resolves — the point at which a bench can be shared. */
export const benchComplete = (state: BenchState) =>
  projectComplete(state) && Boolean(state.skill && state.to && state.prove);

/** Loading a preset replaces the three fields and leaves the rest untouched. */
export const applyPreset = (
  state: BenchState,
  bench: Preset["bench"],
): BenchState => ({
  ...state,
  ...bench,
  // Consent never carries across a target change.
  authorized: false,
});
