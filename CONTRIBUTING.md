# Contributing to the Career Bench

The Career Bench lives at [`/bench`](https://github.com/NUSecurity/NUSEC/tree/main/src/bench). It is built from tiles, and **a merged tile is a Tier-1 Prove item** — someone who could have said no said yes. The contribution model and the product concept are deliberately the same loop.

Targets are the easiest contribution and the best place to start.

---

## Where things live

```
src/bench/
  types.ts            the schema — every tile type, and the ID unions
  index.ts            lookups + the link-graph validator
  compose.ts          which combinations are legal
  checks.ts           the seven coherence checks + closing sentence
  url.ts              bench state ⇄ URL
  tiles/
    patterns.ts       17 verbs
    targets.ts        21 objects
    artifacts.ts      9 outputs
    kits.ts           6 prerequisites
    domains.ts        8 domains — these own the pooled resources
    skills.ts         29 skills, four rungs each
    prove.ts          25 gates
    presets.ts        6 worked benches
    verified.ts       the verification date stamps
```

Tiles are TypeScript object literals rather than YAML. That's on purpose: `npm run typecheck` becomes the validator, and every declared edge is a union of real tile IDs — so a pattern that demands a skill which doesn't exist is a compile error, not a broken link someone finds in a meeting.

You do not need to know React to add a tile. You need to copy the shape of the one above it.

---

## Adding a target (start here)

Two steps.

**1.** Add the ID to the `TargetId` union in `src/bench/types.ts`.

**2.** Add the tile to `src/bench/tiles/targets.ts`:

```ts
{
  id: "TGT-YOURTHING",
  name: "Short name",
  phrase: "how it reads mid-sentence",   // "I am tearing down <phrase>"
  brief: "Two or three sentences. Plain language.",
  classes: ["physical-device", "embedded"],
  cost: "$15–30",
  sourcing: "Where to actually get one, and which variant to get.",
  gotchas: "What bites people. Safety first if there is any.",
  requires_kits: ["KIT-HWBENCH"],
  authorization: "owned",
  first_move: "The smallest physical action that starts this.",
  failure_mode: "How people actually lose here.",
  effort: 2,
}
```

Then `npm run typecheck && npm run dev`, and check the console — the link-graph validator runs in dev and will tell you if anything doesn't resolve.

---

## Writing a tile well

Four fields do almost all the work. Get these right and the rest is easy.

### `first_move` — the smallest physical action

Never *"research X"*. Never *"learn about Y"*. A first move is something a student can do tonight, with what they have.

> ❌ "Research common IoT vulnerabilities."
> ✅ "Order a USB-UART adapter. It's about $12 and nothing else in this domain starts without it."

> ❌ "Familiarize yourself with the firmware."
> ✅ "Download two consecutive versions of the same firmware and run `binwalk` on both. What changed between them is your lead."

Student plans die because step one was never concrete. This field is the fix.

### `failure_mode` — how people actually lose

Not the theoretical risk — the thing you have watched happen. Specific, and about behavior rather than about the topic.

> ❌ "This can be difficult for beginners."
> ✅ "Taking it apart in one session with no photos, then being unable to reassemble it or write about it."

If you have never seen anyone fail at this, you are probably not the right person to write this tile yet. That's fine — open an issue describing the tile instead and let someone who has write it.

### `brief` — two or three sentences

Plain language. No jargon that the tile itself is supposed to teach. Say what the thing *is* and why someone would pick it, not why it's important.

### `gotchas` (targets only) — what bites people

**If there is a safety issue, it goes here and it goes first.** Mains voltage, transmitting on regulated bands, cloning access credentials, cloud billing. Be blunt.

---

## Rules that aren't negotiable

**University systems are not targets.** Not as a target, not as an example in any brief. A student who wants to test a university service goes through whatever disclosure channel the university actually has. That's a different conversation and not one a tile should nudge anyone toward. PRs adding one will be closed.

**Every target needs an honest `authorization`.** Three values a student satisfies alone (`owned`, `deliberately-vulnerable`, `public`). Two need someone else's word (`team-authorized`, `scoped-program`) and make the composer hard-block until the student attests they have it. If you are unsure which applies, it's one of the last two.

**Prove tiles are Tier 1 or above.** Tier 0 — your own blog, your own repo, a LinkedIn post — is what the Project field already produces. If nobody could have rejected it, it isn't proof and it doesn't go in `prove.ts`.

---

## Adding a resource

Resources are **pooled at the domain**, not per skill. A `DOM-RE` pool serves all four RE skills; a skill carries only the two or three things unique to it. This is the whole reason the link list stays maintainable instead of becoming 1,000 rotting URLs.

All eight domains ship a pool. The `depth: "stub"` state and its contribute copy stay in the schema for any domain added later, but nothing currently uses it — a student who picks a skill and finds nothing has hit a dead end, and a dead end reads as neglect however politely it's worded.

Each type is capped, and the validator enforces it:

| Type | Role | Max |
|---|---|---|
| `foundation` | The one book or course | 2 |
| `hands-on` | Where you practice | 4 |
| `reference` | What stays open while working | 3 |
| `corpus` | Real material to work on | 4 |
| `community` | Where you ask when stuck | 2 |

**The cap is a feature.** Fifteen slotted beats twenty flat, because the cap forces a choice and the choosing is the service being provided. If a pool is full and yours is better, replace an entry and say which one in the PR.

### `last_verified`

```ts
last_verified: V_2026_09,   // you opened it and it was what the note says
last_verified: null,        // you haven't checked
```

This means **you opened the link and confirmed it is still the thing the note describes**. It does not mean "the date I added it." A date nobody checked makes decay invisible, which is worse than no date at all — so if you haven't opened it, use `null` and it renders honestly as unverified.

Entries past twelve months grey out and show a "verify this" link that opens a pre-filled issue. Checking one takes thirty seconds.

---

## Adding a link to a tile

Separate from resources. `links` on a target or a prove tile is "go here to do this thing" — the official certification page, where to buy the device, the protocol spec. Not slot-capped and not pooled, because they aren't a learning path.

```ts
links: [
  { title: "CompTIA Security+", url: "https://...", last_verified: V_2026_09 },
],
```

Same honesty rule as resources: the date means you opened it.

## Suggesting a tile without writing code

Open an issue using the **Suggest a tile** template. This is also how tiles invented in a meeting get captured — someone writes down the idea on the spot, it becomes an issue, and whoever picks it up gets the Tier-1 item.

---

## Before you open the PR

```bash
npm run typecheck && npm run lint && npm run dev
```

The link-graph validator runs in dev and logs to the browser console. It checks duplicate IDs, slot caps, patterns with no reachable target, skills nothing exercises, the `demands` → `exercised_by` invariant, and that all six presets still resolve. A clean console means the data is coherent.
