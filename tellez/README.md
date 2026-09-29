# The Tellez Incident

A simulated desktop investigation, played live in a browser during an NUSEC
meeting. Participants get past a lock screen, dig through a fake computer that
belonged to a former club president, and work out where the money went.

**New here? Read [START-HERE.md](START-HERE.md).** Five minutes, written for
humans, and it covers how to brief your agent so you get something good rather
than something plausible.

- **[CHALLENGES.md](CHALLENGES.md)** — every discovery, what it asks of a
  player, and every answer. Read this before designing anything.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — how it is built and how to extend it.
  §7 is the authoring contract.

Adding a challenge? Read the register, then §7, then update the register in the
same commit.

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
- **Refreshing keeps your progress**, on purpose. To start over as a new
  player, use the power button in the Start menu, or "Not you? Start over" on
  the lock screen.
- **`npm run preflight`** validates the content. The build runs it, so a broken
  lock or a missing asset fails the build rather than surfacing mid-meeting.
- **`npm run check:api`** bundles every handler in `api/` the way Vercel will.
  Vercel builds functions *after* `npm run build` passes, so a broken server
  import otherwise gets through both typecheck and build and fails in the
  cloud. Part of `npm run build`.
- **`npm run walk`** plays the entire investigation against a running dev
  server and checks every gate and objective along the way. Preflight proves
  the content is *consistent*; this proves it is still *solvable*. Run it after
  any change to the engine, or to a module something else depends on — with
  several people authoring, the chain is what breaks quietly.

### Walking the whole thing by hand

`npm run walk` does this automatically; here it is for a human:

1. Join with any name.
2. Sign in as `atellez` / `ultimateguitar`.
   *In the real event this comes from Alec's old posts in the NUSEC Discord.*
3. Open the **Recycle Bin**, read `notes-to-self.txt`.
4. Decode `YXRlbGxlei5hZG1pbg==` → `atellez.admin`, with **Cipher Bench** in the
   Start menu or any base64 decoder.
5. Open the **notes** folder on the desktop, read `tuning-notes.txt` → `dadgad-capo2`.
6. Open the **Web Browser**, go to `ledger.brightlinepay.hack`, sign in, read **Payouts**.
7. Open the **Classified** tab. Enter `dadgad-capo2` again, open **Authenticator**
   on the desktop and approve the request, then answer `thursday`,
   `the cuckoo's egg` and `Arjun Uppal`. Read **Transfers**, **Documents** and
   **Messages**; the chat ends pointing at Jessica James Okafor's Instagram.

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
- **No third region.** Several apps may be open, but the screen has two regions on purpose.
- **Fake hostnames use `.test`, `.invalid` or `.example`.** An invented domain
  that turns out to be real points a room full of security students at a
  stranger's website. Preflight enforces this one.

---

## Deploying

Vercel, same as the main site — but its **own project**, so it cannot take
nusec.club down with it. The isolation comes from one setting: Root Directory.

### One-time setup

1. **Push the branch.**

   ```bash
   git push -u origin tellez-incident
   ```

2. **Create a second Vercel project** from `NUSecurity/NUSEC`.

   Vercel's import screen gives you no branch picker — the branch chip next to
   the repo name is a *link to GitHub*, not a dropdown — and it always imports
   the repository's default branch, `main`. You also cannot set Root Directory
   to `tellez` during import, because `tellez/` does not exist on `main` and the
   build fails with "Root Directory does not exist".

   So both settings have to be changed *after* the project exists:

   **During import** — change only the project name (to `tellez-incident`,
   say), leave Root Directory as `./`, and **do not import the detected
   environment variables**. Those eleven are the main site's CTF flags, picked
   up from the root `.env.example`; they have nothing to do with this app.
   Click Deploy. It builds a throwaway copy of the main site, which is fine.

   **Then, in Settings:**

   | Setting | Where it lives | Value |
   |---|---|---|
   | Production branch | **Environments → Production → Branch Tracking** | `tellez-incident` |
   | Root Directory | **Build and Deployment** | `tellez` |
   | Framework Preset | **Build and Deployment** | Vite |

   The production branch is *not* under Settings → Git, despite that being the
   obvious place and where it used to live. Vercel moved it to the Production
   environment; searching the dashboard for "branch" finds nothing.

   Root Directory is the load-bearing one. With it set, this project only ever
   sees `tellez/`, and the main site's build is untouched.

   **Changing the branch does not deploy anything.** Vercel applies the setting
   but leaves the existing deployment alone until the next push. So finish by
   pushing a commit to `tellez-incident` — an empty one is enough:

   ```bash
   git commit --allow-empty -m "Trigger first production deploy" && git push
   ```

   Everything after that is automatic on every push to the branch.

   **Optional, but it keeps the project tidy:** with Root Directory set to
   `tellez`, any deployment from `main` fails, because that directory does not
   exist there — so every push to the main site would leave a red build in this
   project. Settings → Build and Deployment → **Ignored Build Step** → *Only
   build if there are changes in a folder* → `tellez` cancels those instead.

3. **Add a database.** Project → Storage → Neon (Postgres). Vercel sets
   `DATABASE_URL` for you. The schema is created on first use — there is no
   migration step.

4. **Add the other two variables** (Settings → Environment Variables):

   ```
   SESSION_SECRET         openssl rand -base64 32
   FACILITATOR_PASSWORD   whatever you'll type on the night
   ```

   Both are required in production. `SESSION_SECRET` unset means nobody can
   join; `FACILITATOR_PASSWORD` unset means the board stays shut, deliberately.

5. **Add the domain** `tellez.nusec.club` and point a CNAME at Vercel. The apex
   stays with the existing site.

### Checking a deploy

`GET /api/health` answers the only question that matters:

```bash
curl -s https://tellez.nusec.club/api/health | python3 -m json.tool
```

`"ok": true` means the database is reachable, all three variables are set, and
the content passes preflight. Anything wrong comes back as **503** with a named
problem — an unset variable, a database it cannot reach, a broken lock.

You can also play the whole investigation against production:

```bash
WALK_BASE=https://tellez.nusec.club npm run walk
```

That leaves one `walker-####` session on the board. Run it before people arrive
and ignore the row.

### Run of show

1. **Confirm Alec's Discord messages are findable.** The first challenge depends
   entirely on this and it is the one piece the app cannot provide. Decide the
   fallback for anyone not in the Discord — the board can release hints.
2. `curl .../api/health` → `"ok": true`.
3. Open `/board` and check the storage badge says **postgres**, not file. Amber
   means `DATABASE_URL` did not take, and progress will fragment across
   serverless instances.
4. Hit `/api/health` once more a few minutes before the room fills. Neon's free
   tier suspends when idle, and you do not want participant number one paying
   that cold start.
5. Walk it cold on a laptop.

Progress lives in Postgres, so unlike the escape room a mid-meeting redeploy
does not wipe anyone's session. Still, don't ship during a meeting.
