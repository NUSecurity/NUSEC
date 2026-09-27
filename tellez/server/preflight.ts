/**
 * Content validation.
 *
 * Every check here exists because the failure it catches is otherwise
 * completely silent until somebody hits it mid-meeting: a lock pointing at an
 * objective that no longer exists, a file nobody can reach, an asset that was
 * never committed. The build runs this, and the facilitator board shows the
 * result so it can be checked on the night.
 *
 * What it cannot check: whether a lock has a *discoverable* route to opening
 * it. That one is on the author to walk cold.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { assetDir } from "./assets.js";
import { isKnownApp } from "../shared/apps.js";
import { EMPTY_PROGRESS } from "./locks.js";
import { Directory, FileNode, ImageFile, pathKey } from "./vfs.js";
import type { World } from "./world.js";

export interface PreflightResult {
  ok: boolean;
  problems: string[];
}

/**
 * `checkAssets` is on at build time and off at runtime. A missing asset already
 * failed the build, and re-checking from inside a serverless function only
 * risks the board reporting a phantom problem because the working directory is
 * not what the filesystem check assumed.
 */
export function preflight(world: World, checkAssets = true): PreflightResult {
  // Collisions found while merging. Everything else is downstream of these, so
  // they are reported first.
  const problems: string[] = [...world.problems];

  const objectiveIds = new Set(world.allObjectives().map((o) => o.id));
  const secretIds = new Set(world.allSecrets().map((s) => s.id));
  const paths = new Set(world.allNodes().map((node) => pathKey(node.path)));

  /* ------------------------------------------------------------- nodes */

  for (const node of world.allNodes()) {
    const where = `${node.moduleId}: "${node.path}"`;

    for (const id of node.lock.refs().objectives) {
      if (!objectiveIds.has(id)) {
        problems.push(`${where} is locked behind objective "${id}", which no module declares`);
      }
    }

    for (const id of node.lock.refs().secrets) {
      if (!secretIds.has(id)) {
        problems.push(`${where} is locked behind secret "${id}", which no module declares`);
      }
    }

    for (const id of node.reveals) {
      if (!objectiveIds.has(id)) {
        problems.push(`${where} reveals objective "${id}", which no module declares`);
      }
    }

    // Orphans: a node whose parent was never declared can be opened by URL but
    // can never be *found*, which makes it invisible content.
    const parent = node.parentPath;
    if (parent !== null && !paths.has(pathKey(parent))) {
      problems.push(`${where} has no parent directory — nothing lists it, so nobody can find it`);
    }
    if (parent !== null && !(world.node(parent) instanceof Directory)) {
      if (paths.has(pathKey(parent))) {
        problems.push(`${where} sits inside "${parent}", which is not a directory`);
      }
    }

    if (node instanceof FileNode && !isKnownApp(node.opensWith)) {
      problems.push(`${where} opens with "${node.opensWith}", which is not in shared/apps.ts`);
    }

    if (checkAssets && node instanceof ImageFile) {
      if (!existsSync(resolve(assetDir(), node.asset))) {
        problems.push(`${where} needs asset "${node.asset}", which is missing from server/content/assets/`);
      }
    }
  }

  /* -------------------------------------------------------- objectives */

  for (const objective of world.allObjectives()) {
    const where = `${objective.moduleId}: objective "${objective.id}"`;
    const trigger = objective.trigger;

    if (!objective.note) {
      problems.push(`${where} has no note — the board is unreadable without one`);
    }

    if (trigger.on === "open" && !paths.has(pathKey(trigger.path))) {
      problems.push(`${where} triggers on opening "${trigger.path}", which no module declares`);
    }

    if (trigger.on === "secret" && !secretIds.has(trigger.id)) {
      problems.push(`${where} triggers on secret "${trigger.id}", which no module declares`);
    }

    if (trigger.on === "visit") {
      const site = world.site(trigger.host);
      if (!site) {
        problems.push(`${where} triggers on host "${trigger.host}", which no module declares`);
      } else if (trigger.path && !world.resolveRoute(trigger.host, trigger.path)) {
        problems.push(`${where} triggers on "${trigger.host}${trigger.path}", which matches no route`);
      }
    }

    if (trigger.on === "all") {
      for (const dep of trigger.objectives) {
        if (!objectiveIds.has(dep)) {
          problems.push(`${where} depends on objective "${dep}", which no module declares`);
        }
      }
    }
  }

  /* ------------------------------------------------------------- sites */

  for (const site of world.allSites()) {
    const where = `${site.moduleId}: site "${site.host}"`;

    if (!/\.(test|invalid|example)$/i.test(site.host)) {
      problems.push(
        `${where} does not use a reserved TLD (.test/.invalid/.example) — ` +
          `an invented domain that turns out to be real points the room at a stranger`,
      );
    }

    if (site.auth) {
      for (const id of [site.auth.usernameSecret, site.auth.passwordSecret]) {
        if (!secretIds.has(id)) {
          problems.push(`${where} authenticates with secret "${id}", which no module declares`);
        }
      }

      for (const protectedPath of site.auth.protects) {
        if (!site.routes.some((route) => route.path === protectedPath)) {
          problems.push(`${where} protects "${protectedPath}", which is not one of its routes`);
        }
      }
    }

    for (const route of site.routes) {
      for (const id of route.reveals ?? []) {
        if (!objectiveIds.has(id)) {
          problems.push(`${where} route "${route.path}" reveals unknown objective "${id}"`);
        }
      }

      // A locked route with an unsatisfiable lock is content nobody will see.
      if (route.lock && route.lock.refs().objectives.some((id) => !objectiveIds.has(id))) {
        problems.push(`${where} route "${route.path}" is locked behind an objective no module declares`);
      }
    }
  }

  /* ----------------------------------------------------------- modules */

  for (const module of world.modules) {
    for (const app of module.requiresApps ?? []) {
      if (!isKnownApp(app)) {
        problems.push(`${module.id} requires app "${app}", which is not in shared/apps.ts`);
      }
    }

    for (const item of module.desktopItems ?? []) {
      if (item.target.startsWith("app:") || item.target.startsWith("url:")) continue;
      if (!paths.has(pathKey(item.target))) {
        problems.push(`${module.id}: desktop icon "${item.label}" points at "${item.target}", which does not exist`);
      }
    }

    for (const item of module.startMenuItems ?? []) {
      if (!isKnownApp(item.appId)) {
        problems.push(`${module.id}: start menu entry "${item.label}" opens unknown app "${item.appId}"`);
      }
    }
  }

  /* ------------------------------------------------------ reachability */

  // Nothing should be permanently sealed: every lock in the world must be
  // openable by *some* progress state, which at minimum means its objective
  // is reachable from an empty session.
  const reachable = reachableObjectives(world);
  for (const node of world.allNodes()) {
    for (const id of node.lock.refs().objectives) {
      if (objectiveIds.has(id) && !reachable.has(id)) {
        problems.push(
          `${node.moduleId}: "${node.path}" is locked behind objective "${id}", ` +
            `which nothing can ever fire`,
        );
      }
    }
  }

  return { ok: problems.length === 0, problems };
}

/** Objectives with a trigger that some real thing can actually satisfy. */
function reachableObjectives(world: World): Set<string> {
  const reachable = new Set<string>();

  for (const objective of world.allObjectives()) {
    const trigger = objective.trigger;

    if (trigger.on === "open" && world.node(trigger.path)) reachable.add(objective.id);
    if (trigger.on === "secret" && world.secret(trigger.id)) reachable.add(objective.id);
    if (trigger.on === "appAction") reachable.add(objective.id);
    if (trigger.on === "visit" && world.site(trigger.host)) reachable.add(objective.id);
  }

  for (const node of world.allNodes()) {
    if (node.lock.isOpen(EMPTY_PROGRESS)) for (const id of node.reveals) reachable.add(id);
    else for (const id of node.reveals) reachable.add(id);
  }

  // Composites resolve once their dependencies do.
  const composites = world.allObjectives().filter((o) => o.trigger.on === "all");
  for (let pass = 0; pass <= composites.length; pass += 1) {
    let added = false;
    for (const objective of composites) {
      if (reachable.has(objective.id) || objective.trigger.on !== "all") continue;
      if (objective.trigger.objectives.every((dep) => reachable.has(dep))) {
        reachable.add(objective.id);
        added = true;
      }
    }
    if (!added) break;
  }

  return reachable;
}
