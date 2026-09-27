/**
 * Lock rules, and the progress they are evaluated against.
 *
 * Pure: no I/O, no database, no request. That is deliberate — whether a player
 * may read a file is the single most security-relevant question in the app, and
 * it should be answerable by reading one small file and reasoning, not by
 * standing up a session.
 */

import type { ObjectiveId, SecretId } from "../shared/protocol.ts";

/** Everything a session has earned. Derived from the event log, never stored. */
export interface Progress {
  objectives: ReadonlySet<ObjectiveId>;
  secrets: ReadonlySet<SecretId>;
}

export const EMPTY_PROGRESS: Progress = {
  objectives: new Set(),
  secrets: new Set(),
};

/** What a rule points at, so preflight can prove the target exists. */
export interface LockRefs {
  objectives: ObjectiveId[];
  secrets: SecretId[];
}

export abstract class LockRule {
  abstract isOpen(progress: Progress): boolean;
  /** Human-readable, used only in preflight output and the facilitator board. */
  abstract describe(): string;
  abstract refs(): LockRefs;
}

class AlwaysOpenRule extends LockRule {
  isOpen(): boolean {
    return true;
  }
  describe(): string {
    return "open";
  }
  refs(): LockRefs {
    return { objectives: [], secrets: [] };
  }
}

class RequiresObjectiveRule extends LockRule {
  constructor(private readonly id: ObjectiveId) {
    super();
  }
  isOpen(progress: Progress): boolean {
    return progress.objectives.has(this.id);
  }
  describe(): string {
    return `objective:${this.id}`;
  }
  refs(): LockRefs {
    return { objectives: [this.id], secrets: [] };
  }
}

class RequiresSecretRule extends LockRule {
  constructor(private readonly id: SecretId) {
    super();
  }
  isOpen(progress: Progress): boolean {
    return progress.secrets.has(this.id);
  }
  describe(): string {
    return `secret:${this.id}`;
  }
  refs(): LockRefs {
    return { objectives: [], secrets: [this.id] };
  }
}

class AllOfRule extends LockRule {
  constructor(private readonly rules: LockRule[]) {
    super();
  }
  isOpen(progress: Progress): boolean {
    return this.rules.every((rule) => rule.isOpen(progress));
  }
  describe(): string {
    return `all(${this.rules.map((r) => r.describe()).join(", ")})`;
  }
  refs(): LockRefs {
    return mergeRefs(this.rules);
  }
}

class AnyOfRule extends LockRule {
  constructor(private readonly rules: LockRule[]) {
    super();
  }
  isOpen(progress: Progress): boolean {
    return this.rules.some((rule) => rule.isOpen(progress));
  }
  describe(): string {
    return `any(${this.rules.map((r) => r.describe()).join(", ")})`;
  }
  refs(): LockRefs {
    return mergeRefs(this.rules);
  }
}

function mergeRefs(rules: LockRule[]): LockRefs {
  return {
    objectives: rules.flatMap((rule) => rule.refs().objectives),
    secrets: rules.flatMap((rule) => rule.refs().secrets),
  };
}

/* --------------------------------------------------------- author-facing */

/** The default. Shared, because an open lock carries no state. */
export const alwaysOpen = new AlwaysOpenRule();

export const requiresObjective = (id: ObjectiveId): LockRule =>
  new RequiresObjectiveRule(id);

export const requiresSecret = (id: SecretId): LockRule =>
  new RequiresSecretRule(id);

export const allOf = (...rules: LockRule[]): LockRule => new AllOfRule(rules);

export const anyOf = (...rules: LockRule[]): LockRule => new AnyOfRule(rules);
