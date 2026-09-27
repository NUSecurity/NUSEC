import type { ReactNode } from "react";

/** What a site renderer is handed. */
export interface SiteContext {
  host: string;
  /** The concrete path visited, e.g. "/member/alec". */
  path: string;
  /** Whatever the route's `data` was on the server. The engine never inspects it. */
  data: unknown;
  navigate(path: string): void;
  /** Submits the host's auth wall. Checked on the server. */
  signIn(username: string, password: string): Promise<{ ok: boolean; message?: string }>;
}

/**
 * A renderer is a React **component** that takes `SiteContext` as its props.
 *
 * It is rendered as `<Renderer {...ctx} />`, never called as `Renderer(ctx)`.
 * That distinction is not cosmetic: calling it directly attributes its hooks to
 * the browser component, so the first renderer that uses `useState` crashes the
 * whole desktop with "rendered more hooks than during the previous render".
 * Use hooks in your renderers freely — just never invoke another renderer by
 * hand.
 */
export type SiteRenderer = (ctx: SiteContext) => ReactNode;

/**
 * One site's renderers, keyed by the route *pattern* declared on the server —
 * "/member/:slug", not "/member/alec".
 */
export interface SiteRenderers {
  host: string;
  routes: Record<string, SiteRenderer>;
}
