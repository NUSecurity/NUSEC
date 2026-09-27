# Working on The Tellez Incident

A simulated desktop investigation, played live by ~40 people during an NUSEC
meeting. Several people author it in parallel.

If the person you are working for has not read
[START-HERE.md](START-HERE.md), point them at it — it is the five-minute human
orientation, and it explains what makes a good challenge here.

## Read these first

1. **[CHALLENGES.md](CHALLENGES.md)** — every discovery that exists, what it
   asks of a player, and every answer. **Read it before designing anything**, or
   you will duplicate a puzzle or a filename that is already taken.
2. **[ARCHITECTURE.md §7](ARCHITECTURE.md#7-extension-points--how-to-add-anything)**
   — the authoring contract. Copy-paste recipes for files, apps, websites and
   portals.

## Adding anything

Adding a challenge means **adding data, not editing the engine**. One new file
in `server/content/modules/`, registered in that folder's `index.ts`.

If you find yourself editing `server/engine.ts`, `server/world.ts` or
`client/src/shell/`, stop. You have probably found a missing extension point,
and adding one properly is better than working around it — say so rather than
reaching around the design.

**Update `CHALLENGES.md` in the same commit.** Not afterwards. `npm run build`
fails if a module, objective, credential or hostname is missing from it — that
is deliberate, because documentation that is merely requested drifts within a
week.

## Before you say you are done

```bash
npm run typecheck     # both client and server
npm run build         # preflight + check:api + check:docs + vite build
npm run walk          # plays the whole investigation against a running dev server
```

`npm run dev` needs no database and no accounts. The board is at `/board`,
password `dev` locally.

If you changed anything a player touches, **add checks to `scripts/walk.ts`**.
With several people authoring one filesystem, the chain between modules is what
breaks quietly.

## Rules that are not negotiable

- **Nothing a player has not earned reaches their browser.** Not in the UI, and
  not in the JSON — no progress fields, no objective lists. This audience reads
  the network tab. Objectives are for the facilitator board alone.
- **Never show a player their progress.** No toasts, no checklists, no score.
- **No `NUSEC{...}`.** There are no flags. The only thing a player types is
  something a person on that machine would have typed.
- **Two regions, not a window manager.** Several apps may be open, one is shown.
  Inactive apps are hidden with CSS, *never unmounted* — unmounting throws away
  the state that makes switching back useful. See ARCHITECTURE.md §6.
- **Fake hostnames use an undelegated TLD** — `.hack`, `.corp`, `.internal`,
  `.local`, `.home`, `.test`, `.invalid`, `.example`. `.xyz` and `.web` are
  *real*, so an address on one can send a curious player to a stranger's site.
  Run `dig NS <tld>.` before trusting any TLD not on that list.
- **Relative imports in `api/`, `server/` and `shared/` end in `.js`**, never
  `.ts` and never bare. Vercel transpiles rather than bundles, so anything else
  makes every function 500 at import time. `npm run check:api` enforces it.
- **Original icons only** (Lucide names). No Microsoft assets anywhere.
- **Every objective needs a `note`.** Somebody reads the board live and has to
  decide whether the room is stuck.
- **Every lock needs a discoverable way in, from inside the game.** Preflight
  cannot check this. Walk your own content cold and prove it.

## Style

Match the surrounding code. Comments explain *why* a thing is the way it is —
particularly where the obvious approach is wrong — not what the line does. The
existing comments are the reference; several of them exist because the obvious
version was tried and broke in production.

## Do not

- Do not reintroduce player-facing progress feedback.
- Do not generalise the shell into a real window manager.
- Do not commit secrets to `.env`; challenge credentials live in module files
  on purpose (the repo is public and participants are trusted).
- Do not deploy during a meeting.
