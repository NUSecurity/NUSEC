/**
 * `npm run preflight` — content validation, run by the build.
 *
 * Exits non-zero on any problem, so a broken lock or a missing asset fails CI
 * and the deploy rather than surfacing as a dead end during a meeting.
 */

import { modules } from "../server/content/modules/index.js";
import { preflight } from "../server/preflight.js";
import { World } from "../server/world.js";

const world = new World(modules);
const result = preflight(world);

const counts = {
  modules: world.modules.length,
  nodes: world.allNodes().length,
  objectives: world.allObjectives().length,
  secrets: world.allSecrets().length,
  sites: world.allSites().length,
};

console.log(
  `preflight: ${counts.modules} modules · ${counts.nodes} nodes · ` +
    `${counts.objectives} objectives · ${counts.secrets} secrets · ${counts.sites} sites`,
);

if (result.ok) {
  console.log("preflight: ok");
  process.exit(0);
}

console.error(`\npreflight: ${result.problems.length} problem(s)\n`);
for (const problem of result.problems) console.error(`  - ${problem}`);
console.error("");
process.exit(1);
