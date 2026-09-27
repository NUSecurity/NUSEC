/**
 * Locating the content assets directory at runtime.
 *
 * `vercel.json` ships `server/content/assets/**` into the asset function via
 * `includeFiles`, which places them at that path relative to the deployment
 * root. `process.cwd()` is that root for a Node function — but it is not the
 * project root under every runner (tsx, vitest, a different working directory),
 * and a silently-wrong asset path shows up as a 404 on an image mid-meeting.
 *
 * So: try the candidates, take the first that exists, and remember it.
 */

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RELATIVE = "server/content/assets";

let cached: string | null = null;

export function assetDir(): string {
  if (cached) return cached;

  const here = dirname(fileURLToPath(import.meta.url));

  const candidates = [
    resolve(process.cwd(), RELATIVE),
    resolve(here, "content/assets"),
    resolve(here, "..", RELATIVE),
    resolve(here, "../..", RELATIVE),
  ];

  // Falls back to the first candidate so the caller still gets a sensible path
  // to report in an error, rather than throwing at import time.
  cached = candidates.find((path) => existsSync(path)) ?? candidates[0];
  return cached;
}
