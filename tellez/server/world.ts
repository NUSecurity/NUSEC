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
} from "../shared/protocol.ts";
import type { Progress } from "./locks.ts";
import type { ContentModule, Objective, Secret, SimRoute, SimSite } from "./types.ts";
import { Directory, pathKey, VfsNode } from "./vfs.ts";

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

  constructor(modules: ContentModule[]) {
    this.modules = modules;

    for (const module of modules) {
      for (const node of module.nodes ?? []) this.addNode(module, node);
      for (const objective of module.objectives ?? []) this.addObjective(module, objective);
      for (const secret of module.secrets ?? []) this.addSecret(module, secret);
      for (const site of module.sites ?? []) this.addSite(module, site);
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
