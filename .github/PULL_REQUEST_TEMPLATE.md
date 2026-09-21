## What this changes

<!-- One or two sentences. If it's a tile, name it. -->

## If this adds or changes a tile

- [ ] The ID is in the right union in `src/bench/types.ts`
- [ ] `first_move` is a physical action someone could do tonight — not "research X"
- [ ] `failure_mode` is something I've actually seen happen, not a theoretical risk
- [ ] `brief` is 2–3 sentences of plain language
- [ ] If it's a target: `authorization` is honest, and `gotchas` leads with any safety issue
- [ ] If it's a prove tile: it's Tier 1 or above — someone could genuinely reject it

## If this adds or changes a resource

- [ ] It's in the domain pool unless it's genuinely specific to one skill
- [ ] The slot cap isn't exceeded (or I say below which entry it replaces, and why)
- [ ] `last_verified` is a date I personally opened the link — or `null`

## Checks

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run dev` console shows no link-graph problems
