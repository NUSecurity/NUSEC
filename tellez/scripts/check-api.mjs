/**
 * `npm run check:api` — proves every handler in `api/` will build on Vercel.
 *
 * Vercel compiles each file in `api/` into its own serverless function, and it
 * does that *after* `npm run build` succeeds. So a broken import in server code
 * that the client never touches passes typecheck, passes the build, and then
 * fails in the cloud — or worse, 500s at runtime during a meeting.
 *
 * This bundles each handler the way the Node builder does and fails loudly if
 * anything in its import graph does not resolve. Part of `npm run build`, so
 * nobody has to remember it.
 */

import * as esbuild from "esbuild";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = "api";

function handlers(dir = ROOT, found = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) handlers(full, found);
    else if (name.endsWith(".ts")) found.push(full);
  }
  return found;
}

const route = (file) => `/api/${relative(ROOT, file).replace(/\.ts$/, "")}`;

let failed = 0;

for (const file of handlers()) {
  try {
    const result = await esbuild.build({
      entryPoints: [file],
      bundle: true,
      platform: "node",
      target: "node22",
      format: "esm",
      write: false,
      logLevel: "silent",
      // Dependencies are installed by the runtime; what matters here is that
      // our own relative import graph resolves.
      packages: "external",
    });

    const kb = (result.outputFiles[0].contents.length / 1024).toFixed(0);
    console.log(`  ok    ${route(file).padEnd(18)} ${kb} kB`);
  } catch (error) {
    failed += 1;
    console.error(`  FAIL  ${route(file)}`);
    for (const problem of error.errors ?? []) console.error(`          ${problem.text}`);
  }
}

console.log(failed === 0 ? "check:api: ok" : `\ncheck:api: ${failed} handler(s) failed`);
process.exit(failed === 0 ? 0 : 1);
