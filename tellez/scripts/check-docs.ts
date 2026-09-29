/**
 * `npm run check:docs` — proves CHALLENGES.md still describes the code.
 *
 * Several people author this filesystem in parallel, most of them working
 * through an agent. Documentation that is merely *requested* drifts within a
 * week; documentation that fails the build does not. So this is a build step,
 * not a convention.
 *
 * It checks the things that actually go wrong: a module file nobody registered,
 * a challenge that exists in code but not in the register, an objective the
 * facilitator will see on the board with nothing explaining it, a credential
 * nobody wrote down, and a hostname the docs still mention after it was
 * renamed.
 */

import { readFileSync, readdirSync } from "node:fs";
import { modules } from "../server/content/modules/index.js";
import { World } from "../server/world.js";

const MODULE_DIR = "server/content/modules";
const REGISTER = "CHALLENGES.md";

const problems: string[] = [];
const register = readFileSync(REGISTER, "utf8");
const registry = readFileSync(`${MODULE_DIR}/index.ts`, "utf8");
const world = new World(modules);

const mentions = (needle: string) => register.includes(needle);

/* ------------------------------------------- every module file is wired up */

const files = readdirSync(MODULE_DIR).filter(
  (name) => name.endsWith(".ts") && name !== "index.ts",
);

for (const file of files) {
  if (!registry.includes(file.replace(/\.ts$/, ""))) {
    problems.push(
      `${MODULE_DIR}/${file} is not imported by index.ts — its content does not exist at runtime`,
    );
  }
}

/* ----------------------------------------- every module is in the register */

for (const module of world.modules) {
  if (!mentions(`${module.id}.ts`) && !mentions(`\`${module.id}\``)) {
    problems.push(
      `module "${module.id}" is not described in ${REGISTER} — add a section for it`,
    );
  }
}

/* -------------------------------- every objective is explained to whoever
                                     is reading the board during the event */

for (const objective of world.allObjectives()) {
  if (!mentions(objective.id)) {
    problems.push(
      `objective "${objective.id}" (${objective.moduleId}) is not in ${REGISTER} — ` +
        `it will appear on the board with nothing explaining it`,
    );
  }
}

/* ---------------------------------------------- every answer is written down */

for (const secret of world.allSecrets()) {
  // An env-backed secret deliberately has no committed value to document.
  if (secret.env) continue;
  if (!mentions(secret.value)) {
    problems.push(
      `secret "${secret.id}" (${secret.moduleId}) has a value that does not appear in ` +
        `${REGISTER} — the register is where the answers live`,
    );
  }
}

/* ------------------------------------------------------- hosts, both ways */

const hosts = world.allSites().map((site) => site.host);

for (const host of hosts) {
  if (!mentions(host)) {
    problems.push(`site "${host}" is not in ${REGISTER}`);
  }
}

// Stale references: a hostname the docs still name after a rename.
for (const doc of ["CHALLENGES.md", "README.md", "ARCHITECTURE.md"]) {
  // Fenced blocks hold worked examples — `nushacks-alumni.test` in the "add a
  // site" recipe is meant to be fictional. Only prose references are claims
  // about what exists.
  const text = readFileSync(doc, "utf8").replace(/```[\s\S]*?```/g, "");
  const found = text.match(/[a-z0-9-]+\.[a-z0-9-]+\.(hack|corp|internal|local|home|test|invalid|example)\b/gi) ?? [];

  for (const reference of new Set(found)) {
    if (!hosts.some((host) => host.toLowerCase() === reference.toLowerCase())) {
      problems.push(`${doc} refers to "${reference}", which no module declares — stale after a rename?`);
    }
  }
}

/* --------------------------------------------------------------- report */

console.log(
  `check:docs: ${world.modules.length} modules · ${world.allObjectives().length} objectives · ` +
    `${world.allSecrets().length} secrets · ${hosts.length} sites`,
);

if (problems.length === 0) {
  console.log("check:docs: ok");
  process.exit(0);
}

console.error(`\ncheck:docs: ${problems.length} problem(s)\n`);
for (const problem of problems) console.error(`  - ${problem}`);
console.error(`\nUpdate ${REGISTER} in the same commit as the code. See CLAUDE.md.\n`);
process.exit(1);
