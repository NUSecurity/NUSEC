/**
 * The merged world.
 *
 * Every content module is an additive overlay onto one machine. This file does
 * the merging and, just as importantly, refuses it: two modules claiming the
 * same path, host, objective or secret is a collision, and collisions are
 * reported rather than silently resolved last-writer-wins. That refusal is the
 * whole reason several people can author in parallel without coordinating.
 */

import type {
  DirListing, ModuleId, ObjectiveId, SecretId, SiteHost,
} from "../shared/protocol.js";
import type { Progress } from "./locks.js";
import type { ContentModule, Objective, Secret, SimRoute, SimSite, SiteChallenge } from "./types.js";
import { Directory, pathKey, VfsNode } from "./vfs.js";

/** A registered item, tagged with the module that contributed it. */
type Owned<T> = T & { moduleId: ModuleId };

export interface RouteMatch {
  site: Owned<SimSite>;
  route: SimRoute;
  params: Record<string, string>;
}

export class World {
  readonly modules: ContentModule[];
  readonly problems: string[] = [];

  private readonly nodesByPath = new Map<string, VfsNode>();
  private readonly childrenByParent = new Map<string, VfsNode[]>();
  private readonly objectivesById = new Map<ObjectiveId, Owned<Objective>>();
  private readonly secretsById = new Map<SecretId, Owned<Secret>>();
  private readonly sitesByHost = new Map<SiteHost, Owned<SimSite>>();
  private readonly challengesById = new Map<string, Owned<SiteChallenge>>();
  private readonly challengesByRoute = new Map<string, Owned<SiteChallenge>>();

  constructor(modules: ContentModule[]) {
    this.modules = modules;

    for (const module of modules) {
      for (const node of module.nodes ?? []) this.addNode(module, node);
      for (const objective of module.objectives ?? []) this.addObjective(module, objective);
      for (const secret of module.secrets ?? []) this.addSecret(module, secret);
      for (const site of module.sites ?? []) this.addSite(module, site);
    }

    // A second pass, because a challenge may sit on a site that a later module
    // declares. Module order must stay irrelevant.
    for (const module of modules) {
      for (const challenge of module.challenges ?? []) this.addChallenge(module, challenge);
    }

    this.indexChildren();
  }

  /* ------------------------------------------------------------ building */

  private addNode(module: ContentModule, node: VfsNode): void {
    const key = pathKey(node.path);
    const existing = this.nodesByPath.get(key);

    if (existing) {
      this.problems.push(
        `path collision: "${node.path}" declared by both ` +
          `"${existing.moduleId}" and "${module.id}"`,
      );
      return;
    }

    node.moduleId = module.id;
    this.nodesByPath.set(key, node);
  }

  private addObjective(module: ContentModule, objective: Objective): void {
    const existing = this.objectivesById.get(objective.id);
    if (existing) {
      this.problems.push(
        `objective collision: "${objective.id}" declared by both ` +
          `"${existing.moduleId}" and "${module.id}"`,
      );
      return;
    }
    this.objectivesById.set(objective.id, { ...objective, moduleId: module.id });
  }

  private addSecret(module: ContentModule, secret: Secret): void {
    const existing = this.secretsById.get(secret.id);
    if (existing) {
      this.problems.push(
        `secret collision: "${secret.id}" declared by both ` +
          `"${existing.moduleId}" and "${module.id}"`,
      );
      return;
    }
    this.secretsById.set(secret.id, { ...secret, moduleId: module.id });
  }

  private addSite(module: ContentModule, site: SimSite): void {
    const host = site.host.toLowerCase();
    const existing = this.sitesByHost.get(host);
    if (existing) {
      this.problems.push(
        `host collision: "${site.host}" declared by both ` +
          `"${existing.moduleId}" and "${module.id}"`,
      );
      return;
    }
    this.sitesByHost.set(host, { ...site, host, moduleId: module.id });
  }

  private addChallenge(module: ContentModule, challenge: SiteChallenge): void {
    const existing = this.challengesById.get(challenge.id);
    if (existing) {
      this.problems.push(
        `challenge collision: "${challenge.id}" declared by both ` +
          `"${existing.moduleId}" and "${module.id}"`,
      );
      return;
    }

    const site = this.site(challenge.host);
    if (!site) {
      this.problems.push(
        `${module.id}: challenge "${challenge.id}" is on host "${challenge.host}", which no module declares`,
      );
      return;
    }

    const owned = { ...challenge, host: site.host, moduleId: module.id };
    const added: SimRoute[] = [];

    for (const route of challenge.routes) {
      const key = routeKey(site.host, route.path);
      const taken = site.routes.some((r) => routeKey(site.host, r.path) === key) || this.challengesByRoute.has(key);

      if (taken) {
        this.problems.push(
          `route collision: "${site.host}${route.path}" declared by both ` +
            `"${site.moduleId}" and challenge "${challenge.id}" in "${module.id}"`,
        );
        continue;
      }

      this.challengesByRoute.set(key, owned);
      added.push(route);
    }

    this.challengesById.set(challenge.id, owned);
    // A new array on the world's own copy of the site, so the declaring
    // module's object is never mutated.
    site.routes = [...site.routes, ...added];
  }

  private indexChildren(): void {
    for (const node of this.nodesByPath.values()) {
      const parent = node.parentPath;
      if (parent === null) continue;

      const key = pathKey(parent);
      const siblings = this.childrenByParent.get(key);
      if (siblings) siblings.push(node);
      else this.childrenByParent.set(key, [node]);
    }

    for (const siblings of this.childrenByParent.values()) {
      siblings.sort(compareForDisplay);
    }
  }

  /* ------------------------------------------------------------ querying */

  node(path: string): VfsNode | undefined {
    return this.nodesByPath.get(pathKey(path));
  }

  allNodes(): VfsNode[] {
    return [...this.nodesByPath.values()];
  }

  children(path: string): VfsNode[] {
    return this.childrenByParent.get(pathKey(path)) ?? [];
  }

  objective(id: ObjectiveId): Owned<Objective> | undefined {
    return this.objectivesById.get(id);
  }

  allObjectives(): Owned<Objective>[] {
    return [...this.objectivesById.values()];
  }

  secret(id: SecretId): Owned<Secret> | undefined {
    return this.secretsById.get(id);
  }

  allSecrets(): Owned<Secret>[] {
    return [...this.secretsById.values()];
  }

  site(host: SiteHost): Owned<SimSite> | undefined {
    return this.sitesByHost.get(host.toLowerCase());
  }

  allSites(): Owned<SimSite>[] {
    return [...this.sitesByHost.values()];
  }

  challenge(id: string): Owned<SiteChallenge> | undefined {
    return this.challengesById.get(id);
  }

  allChallenges(): Owned<SiteChallenge>[] {
    return [...this.challengesById.values()];
  }

  /** The challenge guarding a route, by its declared pattern. */
  challengeFor(host: SiteHost, routePath: string): Owned<SiteChallenge> | undefined {
    return this.challengesByRoute.get(routeKey(host, routePath));
  }

  desktopItems() {
    return this.modules.flatMap((module) => module.desktopItems ?? []);
  }

  startMenuItems() {
    return this.modules.flatMap((module) => module.startMenuItems ?? []);
  }

  /**
   * A directory listing, filtered for this session.
   *
   * Concealed children are omitted until their lock opens — that is how a
   * folder nobody has earned stays genuinely undiscoverable rather than
   * appearing greyed out, which would advertise exactly where to look.
   */
  listing(path: string, progress: Progress, showHidden: boolean): DirListing | null {
    const node = this.node(path);
    if (!(node instanceof Directory)) return null;

    const entries = this.children(path)
      .filter((child) => child.visibility !== "concealed" || child.lock.isOpen(progress))
      .filter((child) => showHidden || !child.hidden)
      .map((child) => child.summary());

    return { path: node.path, parent: node.parentPath, entries };
  }

  /** Resolves `host` + `path` against the site's routes, binding `:params`. */
  resolveRoute(host: SiteHost, path: string): RouteMatch | null {
    const site = this.site(host);
    if (!site) return null;

    const wanted = normaliseRoutePath(path);

    for (const route of site.routes) {
      const params = matchRoute(normaliseRoutePath(route.path), wanted);
      if (params) return { site, route, params };
    }

    return null;
  }
}

/* ------------------------------------------------------------ route match */

function routeKey(host: SiteHost, path: string): string {
  return `${host.toLowerCase()} ${normaliseRoutePath(path).toLowerCase()}`;
}

function normaliseRoutePath(raw: string): string {
  const trimmed = raw.split("?")[0].replace(/\/+$/, "");
  return trimmed.startsWith("/") ? trimmed || "/" : `/${trimmed}`;
}

/** Returns bound params on a match, or null. `:name` captures one segment. */
function matchRoute(pattern: string, actual: string): Record<string, string> | null {
  const patternParts = pattern.split("/");
  const actualParts = actual.split("/");
  if (patternParts.length !== actualParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i += 1) {
    const expected = patternParts[i];
    const got = actualParts[i];

    if (expected.startsWith(":")) {
      if (got.length === 0) return null;
      params[expected.slice(1)] = decodeURIComponent(got);
      continue;
    }

    if (expected.toLowerCase() !== got.toLowerCase()) return null;
  }

  return params;
}

/** Directories first, then by name — the ordering every file manager uses. */
function compareForDisplay(a: VfsNode, b: VfsNode): number {
  if (a.kind === "dir" && b.kind !== "dir") return -1;
  if (a.kind !== "dir" && b.kind === "dir") return 1;
  return a.name.localeCompare(b.name, "en", { numeric: true, sensitivity: "base" });
}
