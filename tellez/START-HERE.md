# Start here

You're about to add something to The Tellez Incident. This file is for you, the
human. It explains what the thing is, what you can build, and — the part most
people get wrong — how to point a Claude Code agent at it so you get something
good instead of something plausible.

Read this once. It takes about five minutes.

---

## What we're building

A simulated Windows-style desktop, in a browser, that about forty people
investigate live during a meeting.

The premise: Alec Tellez, our former president, moved club money to a vendor
that turned out to be his own shell company. We have his laptop. Players get
past the lock screen and dig until they can say where the money went.

Three things make it different from a normal CTF:

- **There are no flags.** Nothing to submit, no `NUSEC{...}`. Opening the right
  file *is* the achievement. The only thing a player ever types is a credential
  a real person would have typed.
- **Players are never told how they're doing.** No score, no checklist, no
  "correct!". We see everything on a facilitator board; they see a computer.
- **The files live on the server, not in the browser.** A locked folder isn't
  greyed out — it genuinely isn't there until you've earned it. This audience
  opens devtools, so anything shipped to the browser is already public.

## How the pieces fit

The mental model is short:

**Everyone's content merges into one machine.** You write a module describing
files, folders, websites and credentials. So does everyone else. The engine
merges them into a single filesystem. Two people claiming the same path is a
build error, not a silent overwrite — which is exactly what lets several of us
work at once without coordinating.

**Objectives are what the facilitator sees.** You mark interesting moments
("they found the note") and they appear live on the board during the meeting.
Players never see them.

**It isn't a sequence.** It's a dependency graph. Discoveries 3 and 4 can happen
in either order. Yours doesn't have to slot into a line — it has to be
*reachable* from something a player already has.

## What already exists

Five discoveries, described fully in **[CHALLENGES.md](CHALLENGES.md)** with
every answer. In one line each:

| # | Challenge | The gist |
|---|---|---|
| 0 | The Workstation | Not a puzzle — the base folders and everyday clutter |
| 1 | Getting In | Credentials found in Alec's old Discord posts |
| 2 | What He Threw Away | Fifteen deleted files; one holds a portal address |
| 3 | The Encoded Username | A base64 string in that note |
| 4 | With The Songs | The password, buried in fourteen personal notes |
| 5 | The Vendor Console | Log into the portal, read the payout ledger |

The story currently stops at the ledger. It names an LLC and a masked bank
account, and nobody has followed either.

## What you can build

All of this is supported today, without touching the engine:

- **Files and folders** — text, spreadsheets, email archives, chat logs, images,
  video, hex-viewable binaries, password-protected archives
- **Whole websites**, in the desktop's own browser — a fake alumni directory, a
  company registry, a pastebin clone. This is the OSINT surface.
- **More portals** — a portal is just a site with a login wall. There's no
  notion of *the* portal; build several.
- **New desktop apps** — anything from a log viewer to a registry editor
- **New file types**, if none of the existing ones fit

If you want something the engine can't do, say so rather than working around
it. Adding a proper extension point is usually a small change and everyone
gets it.

---

## Working with your agent

Claude Code already knows the house rules — `CLAUDE.md` in this folder loads
automatically every session. **Don't waste your prompt restating them.** Spend
it on the thing only you know: what the puzzle *is*.

### The shape of a good prompt

Describe the **player's experience**. Let the agent work out the wiring.

> **Weak:** "Add a challenge to the recycle bin."
>
> Too vague. You'll get something generic that probably collides with what's
> already there.

> **Also weak:** "Create a module at `server/content/modules/50-email.ts` that
> exports a ContentModule with a MailArchive node at
> `C:/Users/atellez/Documents/mail.eml` and an objective with an `on: open`
> trigger."
>
> You've done the agent's job and none of your own. If your paths collide or
> your trigger is unreachable you've just instructed it to build that.

> **Good:** "Add a challenge where the player finds Alec's email archive and
> realises he was warned about the vendor twice before the last payment. The way
> in should be the transition checklist that already exists — it mentions
> chasing him for invoices. It should take reading a thread carefully, not
> guessing. Check CHALLENGES.md first so it doesn't collide, then follow
> ARCHITECTURE.md §7. Update CHALLENGES.md and add walk checks."

The good version says what the player does, what the entry point is, and how
hard it should be. Everything else the agent can figure out — and it'll figure
it out better than a guessed file path.

### A starter prompt you can copy

```
Read CLAUDE.md and CHALLENGES.md first.

I want to add: <describe what the player finds and how they get there>

The way in should be <name something that already exists in the game>.

Follow ARCHITECTURE.md §7. Update CHALLENGES.md in the same commit, add
checks to scripts/walk.ts, and run npm run build and npm run walk before
telling me it's done.
```

### Always name the entry point

The single most common failure is a challenge nobody can reach. The build
checks a lot, but it cannot check whether a *human* could find your thing.

So in your prompt, finish this sentence: *"A player gets here because they
already have ___."* If you can't, your challenge isn't reachable yet and the
agent will happily build it anyway.

### Push back when you see these

Your agent is capable and will occasionally be confidently wrong. Worth
catching:

- **Editing the engine.** If it's changing `server/engine.ts`, `server/world.ts`
  or anything in `client/src/shell/`, stop it. Adding a challenge shouldn't
  touch those. Ask what extension point is missing.
- **Showing the player their progress.** Toasts, checklists, "you found it!".
  We removed all of that deliberately.
- **A real domain.** Fake hostnames must use `.hack`, `.corp`, `.internal`,
  `.local`, `.home`, `.test`, `.invalid` or `.example`. `.xyz` and `.web` look
  invented and are real — an address on one can send a curious player to a
  stranger's website. The build enforces this.
- **"It should work now."** Make it run `npm run build` and `npm run walk`. If
  it didn't run them, it doesn't know.

### When something breaks

Paste the whole error in. Don't summarise it — the exact text of a preflight or
`check:docs` failure usually names the fix.

---

## Your first fifteen minutes

```bash
cd tellez
npm install
npm run dev
```

Open **http://localhost:4311**, join with any name, and play the whole thing
through once. Credentials and answers are all in
[CHALLENGES.md](CHALLENGES.md) — you're checking how it *feels*, not solving it.

Then open a second tab at **/board**, password `dev`, and watch yourself move
across it. That's what we'll have on the projector.

Nothing else to set up. No database, no accounts, no Vercel login.

---

## What makes a good challenge here

**Let the evidence teach.** A timestamp that contradicts a story, a deleted
file that names a folder nobody has found, a passphrase sitting in a chat log
three folders away — these teach habits people will actually use. A password
taped under a keyboard teaches nothing.

**Reward reading, not guessing.** The answer should be obvious in hindsight and
impossible to brute force. `dadgad-capo2` works because it's a real guitar
tuning written in a file about guitar tunings — recognisable once found,
unguessable before.

**Vary the texture.** Discovery 4 is deliberately a grind through fourteen
boring notes, sitting between two inference puzzles. All-clever gets exhausting;
all-grind gets dull.

**Assume the room is sharp and slightly adversarial.** They will try `..` in
paths, read the network tab, and guess hostnames. The server is the only thing
between them and the ending.

**Write things that are merely unremarkable.** Not every file needs to matter. A
filesystem where everything is a clue tells you where the clues are.

---

## Before you open a PR

```bash
npm run build     # preflight + API bundling + docs check + build
npm run walk      # plays the whole investigation end to end
```

Then, by hand:

- **Walk your own challenge cold.** Pretend you don't know the answer. Can you
  actually get there from something a player already has?
- **Check the board.** Do your objectives appear, and does the `note` on each
  make sense to someone reading it live under pressure?
- **Confirm CHALLENGES.md matches** what you built. The build checks the ids and
  credentials exist in it; only you can check the description is *true*.

---

## Where things live

| File | What it's for |
|---|---|
| **[CHALLENGES.md](CHALLENGES.md)** | Every discovery and every answer. Read before designing. |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | How it's built. §7 is the authoring recipes. |
| **[CLAUDE.md](CLAUDE.md)** | The rules your agent loads automatically. |
| **[README.md](README.md)** | Running it, and deploying it. |
| `server/content/modules/` | Everything anyone authors. One file per challenge. |

Live at **https://tellez-incident.vercel.app**. Every push to
`tellez-incident` deploys it, so don't push during a meeting.
