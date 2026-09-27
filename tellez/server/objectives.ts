/**
 * Objective triggers and progress derivation.
 *
 * Progress is *derived* from the append-only event log rather than stored
 * alongside it. One source of truth, and replaying the log always reproduces
 * the same state — which also means a session can be audited after the meeting
 * by reading what it actually did.
 *
 * Pure, like `locks.ts`, and for the same reason.
 */

import type { ObjectiveId, SecretId, SiteHost, StoredEvent } from "../shared/protocol.js";
import type { Progress } from "./locks.js";
import { pathKey } from "./vfs.js";
import type { World } from "./world.js";

/**
 * Objectives fire two ways, and both are supported on purpose:
 *
 * - the objective names what fires it — `trigger: { on: "open", path }`
 * - the node names what it fires — `reveals: ["some-objective"]`
 *
 * The first reads better when objective and node live in the same module; the
 * second when a node needs to satisfy an objective that another module owns.
 */
export function objectivesForOpen(world: World, path: string): ObjectiveId[] {
  const key = pathKey(path);
  const fromNode = world.node(path)?.reveals ?? [];

  const fromTriggers = world
    .allObjectives()
    .filter((o) => o.trigger.on === "open" && pathKey(o.trigger.path) === key)
    .map((o) => o.id);

  return unique([...fromNode, ...fromTriggers]);
}

export function objectivesForSecret(world: World, id: SecretId): ObjectiveId[] {
  return world
    .allObjectives()
    .filter((o) => o.trigger.on === "secret" && o.trigger.id === id)
    .map((o) => o.id);
}

export function objectivesForVisit(
  world: World,
  host: SiteHost,
  path: string,
): ObjectiveId[] {
  const match = world.resolveRoute(host, path);
  const fromRoute = match?.route.reveals ?? [];

  const fromTriggers = world
    .allObjectives()
    .filter((o) => {
      if (o.trigger.on !== "visit") return false;
      if (o.trigger.host.toLowerCase() !== host.toLowerCase()) return false;
      // A `visit` trigger with no path fires anywhere on the host.
      return o.trigger.path === undefined || samePath(o.trigger.path, path);
    })
    .map((o) => o.id);

  return unique([...fromRoute, ...fromTriggers]);
}

export function objectivesForAction(
  world: World,
  app: string,
  action: string,
): ObjectiveId[] {
  return world
    .allObjectives()
    .filter((o) => o.trigger.on === "appAction" && o.trigger.app === app && o.trigger.action === action)
    .map((o) => o.id);
}

/**
 * Adds every composite objective whose dependencies are now satisfied, and
 * keeps going until nothing new appears — a composite may depend on another
 * composite. Bounded by the objective count, so it cannot spin.
 */
export function cascade(world: World, reached: Set<ObjectiveId>): Set<ObjectiveId> {
  const result = new Set(reached);
  const composites = world.allObjectives().filter((o) => o.trigger.on === "all");

  for (let pass = 0; pass <= composites.length; pass += 1) {
    let added = false;

    for (const objective of composites) {
      if (result.has(objective.id)) continue;
      if (objective.trigger.on !== "all") continue;

      if (objective.trigger.objectives.every((dep) => result.has(dep))) {
        result.add(objective.id);
        added = true;
      }
    }

    if (!added) break;
  }

  return result;
}

/** Rebuilds a session's progress from its events. */
export function deriveProgress(world: World, events: StoredEvent[]): Progress {
  const objectives = new Set<ObjectiveId>();
  const secrets = new Set<SecretId>();

  for (const event of events) {
    if (event.type === "objective.reached") {
      const id = event.payload.id;
      if (typeof id === "string") objectives.add(id);
      continue;
    }

    if (event.type === "secret.submit" && event.payload.ok === true) {
      const id = event.payload.id;
      if (typeof id === "string") secrets.add(id);
    }
  }

  return { objectives: cascade(world, objectives), secrets };
}

function samePath(a: string, b: string): boolean {
  const clean = (raw: string) => raw.split("?")[0].replace(/\/+$/, "").toLowerCase() || "/";
  return clean(a) === clean(b);
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
