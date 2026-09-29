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
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

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

/**
 * Every relative import in server-side code must end in `.js`.
 *
 * With `"type": "module"`, Vercel *transpiles* these files rather than bundling
 * them, and leaves import specifiers exactly as written. Node's ESM loader
 * never infers an extension, so `"./db.ts"` — or `"./db"` — becomes a dangling
 * reference to a file emitted as `db.js`, and every function 500s at import
 * time with FUNCTION_INVOCATION_FAILED.
 *
 * `.js` is the TypeScript ESM convention precisely because it names the
 * *emitted* file; tsc, tsx, esbuild and Vite all map it back to the `.ts`
 * source, so it costs nothing in development.
 *
 * The bundle check below cannot catch this — esbuild happily resolves either
 * extension — which is how it reached production once already.
 */
function checkSpecifiers() {
  const sources = [];
  for (const dir of ["api", "server", "shared"]) {
    (function walk(d) {
      for (const name of readdirSync(d)) {
        const full = join(d, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (name.endsWith(".ts") || name.endsWith(".tsx")) sources.push(full);
      }
    })(dir);
  }

  let bad = 0;

  for (const file of sources) {
    // Comments are stripped first: kit.ts documents the authoring import in a
    // JSDoc example, and that is not an import.
    const text = readFileSync(file, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");

    for (const match of text.matchAll(/from\s+"(\.[^"]*)"/g)) {
      const spec = match[1];

      if (!spec.endsWith(".js")) {
        console.error(`  FAIL  ${file}`);
        console.error(`          "${spec}" must end in .js — Node ESM will not resolve it in production`);
        bad += 1;
        continue;
      }

      const target = resolve(dirname(file), spec.replace(/\.js$/, ".ts"));
      if (!existsSync(target) && !existsSync(target + "x")) {
        console.error(`  FAIL  ${file}`);
        console.error(`          "${spec}" does not resolve to a TypeScript source`);
        bad += 1;
      }
    }
  }

  if (bad === 0) console.log(`  ok    ${sources.length} files: every relative import is .js and resolves`);
  return bad;
}

failed += checkSpecifiers();

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
