import {
  artifacts,
  getPattern,
  getTarget,
  patterns,
  targets,
} from "@/bench";
import { Artifact, BenchState, Pattern, Preset, Target } from "@/bench/types";

/**
 * Pairing hints for the Project field.
 *
 * These used to be rules: patterns declared which target classes they accepted
 * and the composer refused anything else. That was wrong in practice. Hardening
 * a badge, writing a repo about an IP camera teardown, documenting a process —
 * all real projects the class taxonomy forbade. A grammar that rules out good
 * work is wrong rather than strict.
 *
 * So every combination is now selectable and these functions only answer "what
 * goes together most often", which the UI shows as a quiet marker. Picking in
 * any order works: someone who knows the device but not the verb is as well
 * served as someone who knows the verb.
 */

const sharesClass = (pattern: Pattern, target: Target) =>
  target.classes.some((cls) => pattern.accepts.includes(cls));

/** Patterns commonly used with the target and artifact picked so far. */
export function commonPatterns(state: Partial<BenchState>): Pattern[] {
  return patterns.filter((pattern) => {
    if (state.target && !sharesClass(pattern, getTarget(state.target))) {
      return false;
    }
    if (state.artifact && !pattern.yields.includes(state.artifact)) return false;
    return true;
  });
}

/** Targets this pattern is commonly applied to. */
export function commonTargets(state: Partial<BenchState>): Target[] {
  if (!state.pattern) return targets;
  const pattern = getPattern(state.pattern);
  return targets.filter((target) => sharesClass(pattern, target));
}

/** Artifacts this pattern usually ends in. */
export function commonArtifacts(state: Partial<BenchState>): Artifact[] {
  if (!state.pattern) return artifacts;
  const pattern = getPattern(state.pattern);
  return artifacts.filter((artifact) => pattern.yields.includes(artifact.id));
}

/**
 * Keeps derived state honest after a change.
 *
 * Nothing gets cleared for being an unusual pairing any more — the only rule
 * left is that permission never carries across a target change, because
 * attesting you have one team's sign-off says nothing about another's.
 */
export function reconcile(state: BenchState, previous?: BenchState): BenchState {
  if (previous && state.target !== previous.target) {
    return { ...state, authorized: false };
  }
  return state;
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
