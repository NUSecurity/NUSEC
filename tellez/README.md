# The Tellez Incident

A simulated desktop investigation, played live in a browser during an NUSEC
meeting. Participants get past a lock screen, dig through a fake computer that
belonged to a former club president, and work out where the money went.

**Architecture and the authoring contract: [ARCHITECTURE.md](ARCHITECTURE.md).**
If you are adding a challenge, read §7 of that file first.

---

## Running it

```bash
npm install && npm run dev
```

Then open **http://localhost:4311**. No database, no Vercel login, no accounts —
with `DATABASE_URL` unset the app writes to a JSON file under `.state/`, and the
API handlers are mounted straight onto the Vite dev server.

Two things worth knowing while you work:

- **The facilitator board is at `/board`**, password `dev` locally.
- **`npm run preflight`** validates the content. The build runs it, so a broken
  lock or a missing asset fails the build rather than surfacing mid-meeting.
- **`npm run walk`** plays the entire investigation against a running dev
  server and checks every gate and objective along the way. Preflight proves
  the content is *consistent*; this proves it is still *solvable*. Run it after
  any change to the engine, or to a module something else depends on — with
  several people authoring, the chain is what breaks quietly.

### Walking the whole thing by hand

`npm run walk` does this automatically; here it is for a human:

1. Join with any name.
2. Sign in as `ultimateguitar` / `hellohackers`.
   *In the real event this comes from Alec's old posts in the NUSEC Discord.*
3. Open the **Recycle Bin**, read `notes-to-self.txt`.
4. Decode `YXRlbGxlei5hZG1pbg==` → `atellez.admin`.
5. Open the **notes** folder on the desktop, read `tuning-notes.txt` → `dadgad-capo2`.
6. Open **Nettle**, go to `ledger.brightlinepay.test`, sign in, read **Payouts**.

---

## Layout

```
shared/          the client/server contract — types and app ids, never data
server/
  content/
    modules/     EVERYTHING AUTHORS WRITE. One file per challenge.
    kit.ts       the single import for authoring
  locks.ts       lock rules — pure
  objectives.ts  triggers and progress derivation — pure
  world.ts       merges modules, refuses collisions
  engine.ts      the service layer the API handlers call
  preflight.ts   content validation
api/             thin Vercel serverless wrappers over engine.ts
client/src/
  shell/         desktop, taskbar, start menu, the two window slots
  apps/          viewers — one file each, registered in registry.ts
  sites/         the simulated internet's renderers
  pages/         join · play · board
```

**One rule keeps the content gate honest:** nothing in `client/` may import from
`server/`. Only `shared/` crosses the line, and it holds types, never data.

---

## Adding things

Full recipes are in [ARCHITECTURE.md §7](ARCHITECTURE.md#7-extension-points--how-to-add-anything).
The short version — each of these is new files plus one registry line, and none
of them touch the engine:

| To add | Do this |
|---|---|
| Files and folders | A new module in `server/content/modules/`, registered in its `index.ts` |
| A desktop icon | `desktopItems` on your module |
| An app | A file in `client/src/apps/`, its id in `shared/apps.ts`, a line in `registry.ts` |
| A website | `sites` on your module + a renderer in `client/src/sites/` |
| A portal | The same, with an `auth` block. There is no "the" portal — build several |

Three rules that are not negotiable:

- **No content in the client bundle.** If a player can read it before earning
  it, the challenge is broken.
- **No third window.** The shell has two slots on purpose.
- **Fake hostnames use `.test`, `.invalid` or `.example`.** An invented domain
  that turns out to be real points a room full of security students at a
  stranger's website. Preflight enforces this one.

---

## Deploying

A second Vercel project against this repo, **Root Directory `tellez/`**, so it
cannot see or break the main site. Production branch `tellez-incident`, domain
`tellez.nusec.club`.

Environment variables:

```
DATABASE_URL            Neon Postgres. REQUIRED in production — serverless
                        instances share no filesystem, so the dev file store
                        would fragment progress across instances.
SESSION_SECRET          random 32+ characters; signs the session cookie
FACILITATOR_PASSWORD    gates /board. Unset in production = board closed.
```

### Before the meeting

1. **Confirm Alec's Discord messages are findable.** The first challenge depends
   entirely on this and it is the one piece the app cannot provide. Decide the
   fallback for anyone not in the Discord — the board can release hints.
2. `npm run preflight` against the production content.
3. Check `/board` opens, and that its storage badge says **postgres**, not file.
4. **Hit `/api/health`** to wake Neon. Its free tier suspends after a few
   minutes idle, and you do not want participant number one paying that cold
   start.
5. Walk the whole thing cold on a laptop.

Progress lives in Postgres, so unlike the escape room a mid-meeting redeploy
does not wipe anyone's session. Still, don't ship during a meeting.
