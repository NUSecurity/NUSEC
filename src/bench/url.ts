import {
  isArtifactId,
  isKitId,
  isPatternId,
  isProveId,
  isSkillId,
  isTargetId,
} from "@/bench";
import { BenchState, Rung, rungOrder } from "@/bench/types";

/**
 * Bench state lives in the URL. No accounts, no database, no privacy surface,
 * no hosting cost beyond static — and a bench survives the club's
 * infrastructure changing hands. A student can paste theirs into Slack or a
 * co-op application and it still resolves years later.
 *
 *   ?p=PAT-TEARDOWN.TGT-IPCAM.ART-WRITEUP&s=SKL-HW-UART:recognize:use&v=PRV-CLUBBLOG
 *
 * Architecture v2 writes the skill parameter as `SKL-HW-UART:use`. We accept
 * that form and read the rung below as the starting point, but we write the
 * two-rung form, because the sentence says "from X to Y" and a shared bench
 * shouldn't have to re-derive half of itself.
 */

export const emptyBench: BenchState = {
  pattern: null,
  target: null,
  artifact: null,
  skill: null,
  from: null,
  to: null,
  prove: null,
  kits: [],
  authorized: false,
};

const isRung = (value: string): value is Rung =>
  (rungOrder as string[]).includes(value);

/** The rung a bench starts from, given where it's going. Always one below. */
export const rungBelow = (to: Rung): Rung | null => {
  const index = rungOrder.indexOf(to);
  return index > 0 ? rungOrder[index - 1] : null;
};

export function encodeBench(state: BenchState): string {
  const params = new URLSearchParams();

  // Partial projects encode too, with empty segments for what isn't picked
  // yet. The page mirrors state into the URL and reads it back, so a `p` that
  // only appeared once all three were chosen would wipe the pattern and target
  // the moment someone deselected the artifact.
  if (state.pattern || state.target || state.artifact) {
    const segments = [state.pattern ?? "", state.target ?? "", state.artifact ?? ""];
    while (segments.length > 0 && segments[segments.length - 1] === "") {
      segments.pop();
    }
    params.set("p", segments.join("."));
  }

  if (state.skill) {
    const to = state.to;
    const from = state.from ?? (to ? rungBelow(to) : null);
    params.set(
      "s",
      to
        ? from
          ? `${state.skill}:${from}:${to}`
          : `${state.skill}:${to}`
        : state.skill,
    );
  }

  if (state.prove) params.set("v", state.prove);
  if (state.kits.length > 0) params.set("k", state.kits.join("."));
  if (state.authorized) params.set("a", "1");

  return params.toString();
}

/**
 * Decodes a URL into a bench, ignoring anything that doesn't name a real tile.
 * A link from an older build with a since-renamed tile degrades to a partly
 * filled bench rather than a crash.
 */
export function decodeBench(search: string): BenchState {
  const params = new URLSearchParams(search);
  const state: BenchState = { ...emptyBench, kits: [] };

  const [pattern, target, artifact] = (params.get("p") ?? "").split(".");
  if (pattern && isPatternId(pattern)) state.pattern = pattern;
  if (target && isTargetId(target)) state.target = target;
  if (artifact && isArtifactId(artifact)) state.artifact = artifact;

  const skillParts = (params.get("s") ?? "").split(":");
  const [skill, ...rungs] = skillParts;
  if (skill && isSkillId(skill)) {
    state.skill = skill;

    if (rungs.length >= 2 && isRung(rungs[0]) && isRung(rungs[1])) {
      state.from = rungs[0];
      state.to = rungs[1];
    } else if (rungs.length === 1 && isRung(rungs[0])) {
      // v2's shorter form: the target rung alone, start derived.
      state.to = rungs[0];
      state.from = rungBelow(rungs[0]);
    }
  }

  const prove = params.get("v");
  if (prove && isProveId(prove)) state.prove = prove;

  state.kits = (params.get("k") ?? "").split(".").filter(isKitId);
  state.authorized = params.get("a") === "1";

  return state;
}
