# The Tellez Incident — Architecture

A simulated desktop investigation, played live in a browser during an NUSEC
meeting. Participants click around a fake computer belonging to a former club
president and work out where the money went.

This document is the contract. Two other people (and their agents) are building
challenges on top of this foundation — if you are one of them, read
[Authoring an Act](#7-authoring-an-act-read-this-first) first and the rest as
needed.

**Status:** architecture approved, implementation not started.
**Branch:** `telez-incident` · **App root:** `telez/` · **Never merges to `main`.**

---

## 1. What this is, in one paragraph

A locked Windows-shaped desktop loads in the browser. Participants figure out
how to get past the lock screen, then explore a fake filesystem — documents,
mail, chat logs, a recycle bin — assembling the story of how Alec Tellez moved
club funds. **There are no flags and nothing to submit.** Progress is recorded
implicitly: opening the right file *is* the achievement. A facilitator board on
the projector shows, live, where all ~40 people are.

### What it is not

- Not a VM, container, or emulator. Nothing executes. It is a data-driven UI
  over a fake tree.
- Not a window manager. **At most two windows exist: the File Explorer and one
  application.** See [§5.3](#53-the-two-window-rule).
- Not a CTF. No `NUSEC{...}` strings, no submission box, no scoreboard for
  participants. The only thing a participant ever types is an in-world
  credential (a login password, an archive passphrase).

---

## 2. Decisions already made

Locked in on 2026-09-26. Reopen them deliberately, not by accident.

| Question | Decision |
|---|---|
| Host | **Vercel**, second project, Root Directory `telez/` |
| Live state | **Neon Postgres** via Vercel Marketplace, HTTP serverless driver |
| Realtime | **Polling** — facilitator board every 2s. No WebSockets. |
| Code location | Branch `telez-incident` on `NUSecurity/NUSEC`, app under `telez/` |
| Identity | Display name → signed **httpOnly cookie**. No password, no email. |
| Content gate | **Fully server-side.** A locked path returns `403`. |
| Look | Fictional OS, Windows-shaped. Original icons only. |
| Suspect | **Alec Tellez**, former NUSEC president — real person, participating, fiction built around the name |
| Scale | ~40 concurrent |

### 2.1 Why Vercel works here when it didn't for the escape room

The escape room (`~/School/Clubs/NUSEC/escape-room`, Sept 2026) is an Express +
`ws` container on Render, because its gate mechanic requires the **server to
push to players**: your door opens the moment enough teammates finish, with no
reload. A serverless function cannot hold a socket open, so Vercel was out.

This app has no player-to-player synchronisation. The only live data flows one
direction — participant clicks a file, server records it, facilitator board
reads it. That is ordinary request/response plus one polling dashboard, which is
exactly what Vercel serverless functions are for.

Concretely, Vercel supports everything needed: serverless functions with full
Node, response streaming, cookies, custom domains, and environment variables.
The one thing it cannot do — hold a persistent WebSocket — this app never asks
for.

**Capacity sanity check.** 40 people × ~300 interactions ≈ 12,000 function
invocations for the whole meeting, against a 1,000,000/month Hobby allowance.
Capacity is a non-issue; the constraints that actually bite are in
[§8.3](#83-the-four-vercel-limits-that-will-actually-bite-you).

### 2.2 Why the content gate is the load-bearing decision

The escape room README puts it best: on a static site, **any gate is
decoration**. If the fake filesystem ships inside the JS bundle, somebody in a
cybersecurity club opens devtools, reads the lock screen password and the
ending, and the meeting is over in ten minutes.

So the filesystem lives on the server. The client asks for one directory listing
or one file at a time; a path the session has not earned returns `403` and the
browser has genuinely never received the bytes. This costs one fetch per open —
imperceptible — and it keeps the *map itself* a discovery, which matters,
because in a DFIR scenario finding out *where* something is hidden is most of
the puzzle.

> ### ⚠️ Open problem: this repository is public
>
> `NUSecurity/NUSEC` is public, so `telez/server/content/` is readable on GitHub
> by anyone who thinks to look. Server-gating defeats devtools; it does not
> defeat a determined participant finding the branch.
>
> Mitigations, cheapest first — **Mahir to pick one:**
>
> 1. **Secrets in env vars only** (assumed here regardless). Passwords and
>    passphrases never appear in committed files, exactly like the escape room's
>    `flagEnv` pattern. Narrative text stays public. *A spoiler-hunter still
>    reads the story, but cannot skip a single lock.*
> 2. **Content in a private submodule.** `telez/server/content/` becomes its own
>    private repo. Engine stays public and reviewable; story does not. Costs one
>    extra clone step for contributors.
> 3. **Hold the branch local until the event.** Kills parallel collaboration —
>    not viable with two other builders.
>
> Recommendation: **(1) now, (2) before the event** if any act's story is worth
> protecting. This is reversible — it is a file move — which is why the build
> proceeds on (1) rather than blocking.

---

## 3. Stack

```
Client   React 18 + TypeScript + Vite + Tailwind      (matches the main site)
Server   Vercel serverless functions, Node 20, TypeScript, under telez/api/
Data     Neon Postgres, @neondatabase/serverless (HTTP — no pooling needed)
Auth     Signed httpOnly cookie, HMAC-SHA256, no third-party auth
Deploy   Vercel project #2, Root Directory telez/, domain tellez.nusec.club
```

React + Vite + Tailwind deliberately mirrors the main NUSEC site so the stack is
already familiar to contributors. Everything server-side is new.

### 3.1 Why a cookie and not a bearer token

Gated *binary* assets — an image, a PDF, Alec's video — are fetched by the
browser following a plain `<a href>` or an `<img src>`. Those requests cannot
carry an `Authorization` header. A cookie rides along automatically; a token
does not. Same reasoning as the escape room, same conclusion.

Cookie is `HttpOnly`, `Secure`, `SameSite=Lax`, holding `sessionId.hmac`, signed
with `SESSION_SECRET`. The client can never read or forge it.

### 3.2 Why Postgres and not Redis or in-memory

The event log **is the deliverable** — "we can keep track of where certain
people are throughout the challenge." Postgres gives that a queryable shape for
free, during the meeting and after it ("who actually found the recycle bin
file?", "which act stalled everyone?"). Redis would need that reporting built by
hand.

It also fixes the escape room's known weakness, documented in its own README:
in-memory state **is lost on redeploy**, so you must not ship during a meeting.
Postgres survives deploys, so a mid-meeting hotfix is merely tense rather than
catastrophic.

---

## 4. Directory layout

```
telez/
├── ARCHITECTURE.md          this file
├── README.md                how to run it, how to run an event
├── package.json
├── vercel.json              rewrites, function config, includeFiles
├── .env.example             every variable, documented, no real values
│
├── api/                     Vercel serverless functions — thin HTTP wrappers
│   ├── session.ts           POST  create or resume a session
│   ├── unlock.ts            POST  lock screen credential attempt
│   ├── fs/list.ts           GET   gated directory listing
│   ├── fs/read.ts           GET   gated file contents
│   ├── fs/asset.ts          GET   gated binary passthrough (cookie auth)
│   ├── event.ts             POST  batched telemetry
│   ├── board.ts             GET   facilitator view (password-gated)
│   └── health.ts            GET   liveness + DB warm-up
│
├── server/                  server-only. NEVER imported by client code.
│   ├── content/
│   │   ├── acts/
│   │   │   ├── 00-cold-boot.ts      Act 0 — the lock screen
│   │   │   ├── 01-what-he-threw-away.ts  Act I — the recycle bin
│   │   │   └── index.ts             the act registry
│   │   └── assets/                  binary files under ~4 MB
│   ├── vfs.ts               merges acts into one tree; path resolution
│   ├── locks.ts             LockRule evaluation — PURE, no I/O
│   ├── objectives.ts        trigger matching — PURE, no I/O
│   ├── session.ts           cookie issue + verify
│   ├── events.ts            append-only writes, derived progress views
│   ├── db.ts                Neon client, schema, migrations
│   └── preflight.ts         content validation, run at build and from /board
│
├── shared/
│   └── protocol.ts          the client/server contract. Types only.
│
├── client/src/
│   ├── shell/
│   │   ├── Desktop.tsx      wallpaper, icons, enforces the two-window rule
│   │   ├── Taskbar.tsx      clock, start button, window buttons
│   │   ├── StartMenu.tsx
│   │   ├── Window.tsx       title bar, minimise, close
│   │   └── LockScreen.tsx
│   ├── apps/
│   │   ├── registry.ts      every app registers here
│   │   ├── FileExplorer.tsx
│   │   ├── Notepad.tsx
│   │   ├── PhotoViewer.tsx
│   │   ├── MediaPlayer.tsx  ← Alec's video lands here
│   │   ├── LedgerViewer.tsx spreadsheet-shaped viewer
│   │   ├── MailClient.tsx
│   │   ├── Messenger.tsx    chat logs
│   │   └── RecycleBin.tsx
│   ├── lib/
│   │   ├── vfsClient.ts     fetch + cache listings, dedupe in flight
│   │   ├── telemetry.ts     batched, fire-and-forget event emitter
│   │   └── session.ts
│   └── pages/
│       ├── Join.tsx         name entry
│       ├── Play.tsx         the desktop itself
│       └── Board.tsx        facilitator projector view
│
└── scripts/
    └── preflight.mjs        fails the build on broken content
```

**The one rule that keeps the gate honest:** nothing in `client/` may import
from `server/`. Only `shared/protocol.ts` crosses the line, and it contains
types, never data. A build-time check enforces this.

---

## 5. The object model

Everything below is designed so that adding a challenge means **adding data, not
editing the engine**.

### 5.1 The virtual filesystem

```ts
abstract class VfsNode {
  path: string;            // canonical, e.g. "C:/Users/atellez/Documents"
  name: string;            // derived from path
  meta: NodeMeta;          // timestamps, size, attributes
  lock: LockRule;          // AlwaysOpen unless stated
  reveals: ObjectiveId[];  // objectives satisfied by opening this
  abstract kind: NodeKind;
}

class Directory extends VfsNode { kind = "dir"; children: string[] }

abstract class FileNode extends VfsNode { abstract opensWith: AppId }

class TextFile    extends FileNode { body: string }
class SheetFile   extends FileNode { columns: string[]; rows: Cell[][] }
class MailArchive extends FileNode { messages: MailMessage[] }
class ChatLog     extends FileNode { messages: ChatMessage[] }
class ImageFile   extends FileNode { asset: AssetRef; exif?: ExifBlock }
class VideoFile   extends FileNode { asset: AssetRef; poster?: AssetRef }
class ArchiveFile extends FileNode { entries: VfsNode[]; passphrase?: SecretId }
class EncryptedFile extends FileNode { cipher: string; passphrase: SecretId }
class BinaryFile  extends FileNode { hexPreview: string }   // "can't open this"
```

`NodeMeta` carries the DFIR-relevant detail, and it is **puzzle material, not
decoration**:

```ts
interface NodeMeta {
  createdAt: number;
  modifiedAt: number;
  accessedAt: number;
  sizeBytes: number;
  attributes: ("hidden" | "system" | "readonly" | "encrypted")[];
  deleted?: { at: number; originalPath: string };   // recycle bin semantics
  owner?: string;
}
```

Two details worth calling out to contributors:

- **`attributes: ["hidden"]`** means the File Explorer omits it until the
  session has toggled *Show hidden items*. That toggle is itself an objective —
  it is a real investigative habit worth teaching.
- **`deleted.originalPath`** is how a recycle bin item tells you about a folder
  you had not found yet. Act I is built on exactly this.

### 5.2 Locks, objectives, secrets

Three small systems, all evaluated **server-side only**.

```ts
abstract class LockRule { abstract isOpen(p: Progress): boolean }

class AlwaysOpen        extends LockRule {}
class RequiresObjective extends LockRule { id: ObjectiveId }
class RequiresSecret    extends LockRule { id: SecretId }
class AllOf             extends LockRule { rules: LockRule[] }
class AnyOf             extends LockRule { rules: LockRule[] }
```

```ts
interface Objective {
  id: ObjectiveId;
  actId: ActId;
  title: string;          // shown on the facilitator board
  note?: string;          // why it matters, for whoever is running the room
  hidden?: boolean;       // participants never learn this objective exists
  trigger: ObjectiveTrigger;
}

type ObjectiveTrigger =
  | { on: "open";      path: string }
  | { on: "secret";    id: SecretId }
  | { on: "appAction"; app: AppId; action: string }
  | { on: "all";       objectives: ObjectiveId[] };   // act completion
```

```ts
interface Secret {
  id: SecretId;
  env: string;                 // e.g. "SECRET_TELLEZ_LOGIN" — value NEVER committed
  devValue: string;            // used only when NODE_ENV !== "production"
  normalise?: "trim" | "lower" | "alnum";
  hints?: string[];            // facilitator can release these from /board
}
```

**Secrets follow the escape room's `flagEnv` pattern exactly**, and for the same
reason: an unset variable in production must fail loudly rather than silently
accept a placeholder. In development it falls back to `devValue`; in production
an unset secret is unenterable and the preflight names it.

This is what "no flags" means in practice. A participant never submits an
answer — `{ on: "open" }` triggers fire implicitly from reading a file, and the
only typed input in the whole game is an in-world credential.

### 5.3 The two-window rule

There is no window manager and there must never be one. The shell holds exactly
two slots:

```ts
class DesktopShell {
  explorerSlot: WindowState | null;   // always the File Explorer
  appSlot:      WindowState | null;   // whatever was opened last

  openExplorer(path: string): void;   // fills or refocuses explorerSlot
  open(node: FileNode): void;         // REPLACES whatever is in appSlot
  close(slot: "explorer" | "app"): void;
}
```

Opening a second document replaces the first. This is deliberate: it removes
z-ordering, drag-to-reorder, focus management, tiling, and minimise-restore
choreography — roughly all of the cost of a desktop UI — while keeping the
feel. Layout is a fixed two-pane arrangement, not free-floating geometry.

> **To contributors and their agents:** you will be tempted to generalise this
> into a real window manager. Do not. If a challenge seems to need three
> windows, it needs redesigning. The constraint is the feature.

### 5.4 Applications

```ts
interface DesktopApp {
  id: AppId;
  title: string;
  icon: IconName;                       // Lucide only — no Microsoft assets
  showInStartMenu: boolean;
  opens: NodeKind[];                    // which file kinds this app claims
  render(props: AppProps): JSX.Element;
}

interface AppProps {
  node?: FileNode;        // absent for apps launched from the Start menu
  vfs: VfsClient;         // gated reads; a 403 is a normal, expected outcome
  emit: TelemetryEmitter; // emit("app.action", { app, action })
  close(): void;
}
```

Apps register themselves in `client/src/apps/registry.ts`. Adding one is a new
file plus one registry line — no engine changes.

An app is a **viewer**. It renders what the server sent and emits events. It
never decides whether something is unlocked; that answer only ever comes back
from the server as content or as a `403`.

### 5.5 Sessions and telemetry

```ts
interface Session { id: string; displayName: string; startedAt: number; lastSeenAt: number }

interface Event {
  id: string; sessionId: string; at: number;
  type: "session.start" | "unlock.attempt" | "node.open" | "node.denied"
      | "app.launch"    | "secret.submit" | "objective.reached"
      | "app.action"    | "search.query";
  payload: Record<string, unknown>;
}
```

The event table is **append-only** — pleasingly on-theme, and also just the
correct shape for an audit log. Progress is *derived* from events rather than
stored alongside them, so there is one source of truth and replaying the log
always reproduces the same state.

Client batches events and flushes every 2s or on 10 queued, whichever comes
first, `fetch(..., { keepalive: true })` so a closing tab still reports. Failed
flushes are dropped, never retried into a queue that grows forever — telemetry
must not be able to degrade the experience.

### 5.6 Acts — the authoring unit

```ts
interface Act {
  id: ActId;
  order: number;
  title: string;
  summary: string;          // facilitator-facing: what players do here
  nodes: VfsNode[];
  objectives: Objective[];
  secrets: Secret[];
  requiresApps?: AppId[];
}
```

**The filesystem is the merge of every act's nodes.** Acts are additive overlays
onto one shared tree, which is what lets three people build in parallel without
touching each other's files. Two acts declaring the same path is a build
failure, not a silent last-writer-wins.

---

## 6. Data flow

### Opening a file

```
click in File Explorer
  → GET /api/fs/read?path=...        (cookie rides along)
  → verify cookie → load session
  → resolve path in merged VFS       → 404 if no such node
  → derive Progress from event log
  → node.lock.isOpen(progress)?
        no  → append node.denied → 403  (client shows an in-world refusal)
        yes → append node.open
              → fire any objectives triggered by this path
              → return the node's content
  → client routes node.kind to an app → app fills appSlot
```

A denied open is **in-world**, never a modal error: "Access is denied." with a
Windows-shaped dialog. Participants should not be able to distinguish a locked
file from a file that is merely uninteresting — otherwise the `403`s become a
treasure map straight to every secret.

### The facilitator board

`GET /api/board` every 2s, password-gated by `FACILITATOR_PASSWORD`, returning:

- every session, its display name, current act, objectives reached, last-seen
- a per-objective completion count — **which is how you spot a stuck room**
- a live event ticker
- the preflight result

Polling, not push. One dashboard hitting one endpoint every 2s for ninety
minutes is ~2,700 requests. The added complexity of Supabase Realtime or SSE
buys nothing here.

Board is at `/board`, unlisted, password-gated, and **never** linked from the
participant UI.

---

## 7. Authoring an Act — read this first

If you are one of the two people building challenges, this section is your job
description. Act I (`server/content/acts/01-what-he-threw-away.ts`) is a working
reference — copy its shape.

### The five steps

1. **Create** `server/content/acts/NN-your-act.ts`, exporting one `Act`.
2. **Declare your nodes.** Every path you introduce must be unique across all
   acts. Nest under a folder that is clearly yours to avoid collisions.
3. **Declare objectives.** At minimum one per thing you want to see on the
   board. Give each a `note` — the person running the room reads it live and
   needs to know what it means when it lights up.
4. **Declare secrets** if your act has a credential. Add the `env` name to
   `.env.example` *and* to the Vercel project's environment variables. Never
   commit a real value.
5. **Register** the act in `server/content/acts/index.ts`.

Run `npm run preflight`. It fails on:

- two acts declaring the same path
- a `LockRule` referencing an objective that does not exist
- an objective whose trigger path does not exist
- a declared asset missing from the build
- a secret whose `env` variable is absent (warning locally, **error** in prod)
- a node unreachable from any directory — an orphan nobody can ever find

This is lifted from the escape room's `/gm` preflight, which exists because both
of those failure modes are otherwise **completely silent until somebody hits
them mid-meeting**.

### Rules that are not negotiable

- **No content in the client bundle.** If a participant can read it before
  earning it, the act is broken.
- **No third window.** See [§5.3](#53-the-two-window-rule).
- **No `NUSEC{...}` anywhere.** There are no flags. The only thing a participant
  types is something a person on that machine would have typed.
- **Every lock must have a discoverable path to opening it**, and that path must
  live *inside the game*. Preflight cannot check this. You must walk your own
  act cold and prove it.
- **Secrets come from env vars.** Never a literal in a committed file.

### Design guidance

Make the evidence do the teaching. A timestamp that contradicts a story, a
`deleted.originalPath` pointing at a folder nobody found, an archive whose
passphrase is sitting in a chat log three folders away — these teach real
investigative habits. A password taped under a keyboard teaches nothing.

Assume every participant is technical and adversarial. They will try `..` in
paths, they will read the network tab, they will guess paths. The server is the
only thing standing between them and the ending, so let it be the only thing
you rely on.

---

## 8. Deployment

### 8.1 Vercel setup

Second Vercel project against the same repo:

| Setting | Value |
|---|---|
| Root Directory | `telez/` |
| Production Branch | `telez-incident` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Domain | `tellez.nusec.club` (CNAME → Vercel) |

The apex `nusec.club` keeps serving the existing site from project #1. Setting
Root Directory means this project cannot see or break the main site — the same
isolation the escape room got from a separate repo, achieved with a setting.

### 8.2 Environment variables

```
DATABASE_URL            Neon connection string (Vercel Marketplace sets this)
SESSION_SECRET          random 32+ bytes; signs the session cookie
FACILITATOR_PASSWORD    gates /board. UNSET IN PRODUCTION = BOARD CLOSED.
SECRET_TELLEZ_LOGIN     Act 0 lock screen password
SECRET_*                one per act secret
```

`FACILITATOR_PASSWORD` failing closed when unset is deliberate, carried over
from the escape room.

### 8.3 The four Vercel limits that will actually bite you

Capacity is not a concern ([§2.1](#21-why-vercel-works-here-when-it-didnt-for-the-escape-room)). These four are:

1. **4.5 MB function response limit.** Gated binaries stream through
   `api/fs/asset.ts`, so anything larger cannot pass through the gate. Small
   assets (images, PDFs, text) go in `server/content/assets/` and are gated
   normally.
2. **Large media — specifically Alec's video — needs different handling.** A
   video will exceed both the response limit and the 50 MB function bundle
   limit. Put it in Vercel Blob (or `public/` under a random 32-char filename)
   and gate the *URL* rather than the bytes: `api/fs/read.ts` returns the URL
   only to a session that has earned the node. Weaker than a real gate, and the
   right trade for a file that size. Do not let this exception spread to
   anything that fits under 4.5 MB.
3. **`includeFiles` is required.** Serverless bundles exclude files not
   statically imported. `vercel.json` must declare
   `functions: { "api/fs/asset.ts": { includeFiles: "server/content/assets/**" } }`
   or assets 404 in production while working perfectly in dev.
4. **Neon free tier auto-suspends after ~5 minutes idle.** The first query after
   a quiet period pays ~500 ms of cold start. **Hit `/api/health` before the
   room starts** so participant number one is not the one who wakes the
   database. Put it in the run-of-show.

### 8.4 What survives what

| Event | Outcome |
|---|---|
| Function cold start | Fine. Everything is in Postgres. |
| Redeploy mid-meeting | **Sessions and progress survive.** Unlike the escape room. |
| Neon suspend/resume | Fine, modulo the cold start above. |
| Participant closes tab | Cookie persists; reopening resumes the same session. |
| Participant clears cookies | New session, progress orphaned. Board can re-link by name. |

---

## 9. The story, and what gets built first

This pass delivers the **engine plus Act 0 and Act I, fully worked**, as the
reference implementation contributors copy. The beats below are a proposal —
rewrite them freely, they exist to exercise every system.

### Act 0 — Cold Boot

The machine is locked. User `atellez`. Getting in is the first challenge.

The route in is account enumeration, not password guessing: the lock screen also
lists a **Guest** account, which opens to a near-empty desktop with one folder.
In it is a photo of a whiteboard from a club meeting with a password partially
visible, plus the lock screen's own *password hint* to disambiguate the rest.

Teaches: enumerate accounts before attacking one. Exercises: secrets, image
assets, objectives, the lock screen, the first `403`.

Objectives: `guest-account-found` · `whiteboard-photo-opened` ·
`hint-read` (hidden) · `desktop-unlocked`.

### Act I — What He Threw Away

On the real desktop, the Recycle Bin holds several deleted items. Most are
noise. One is a reimbursement spreadsheet whose `deleted.originalPath` points
into a folder that does not appear anywhere in the visible tree — and whose rows
show payments to a vendor that does not exist.

Restoring or reading it unlocks that folder, which is where Acts II+ begin.

Teaches: deleted ≠ gone, and deletion metadata is itself evidence. Exercises:
recycle bin semantics, `SheetFile`, `RequiresObjective` unlocking a directory,
hidden attributes.

Objectives: `recycle-bin-opened` · `decoy-file-opened` (hidden, shows who is
thorough) · `ledger-found` · `hidden-folder-unlocked`.

### Acts II+ — the other two builders

Deliberately unspecified. The engine supports mail, chat logs, encrypted files,
password-protected archives, EXIF, and browser history without further
engine work. **Alec's video, if he records one, belongs late** — it is the
strongest single asset available and should pay off the investigation rather
than open it.

---

## 10. Open questions

1. **Public repo exposure.** See the callout in [§2.2](#22-why-the-content-gate-is-the-load-bearing-decision). Needs a decision before the event, not before the build.
2. **Meeting date.** Unknown. Determines how much of Acts II+ is realistic.
3. **Spelling.** The branch is `telez-incident` (as named), the suspect is
   **Alec Tellez**. Say the word and the branch and directory become `tellez`.
4. **OS name.** Placeholder **HuskyOS**. One constant, trivial to change.
5. **Post-event.** Leave it up as a permanent recruiting demo, or take it down?
   Affects whether the board and event log stay reachable.

---

## 11. Related work in this org

- **`~/School/Clubs/NUSEC/escape-room`** — the team-versus-team escape room.
  Different problem (needs real push, hence Render), but the patterns for
  server-gated content, `flagEnv` secrets, the facilitator console, and content
  preflight all came from there and are reused here. Read its README.
- **`NUSecurity/NUSEC` `main`** — the club site. Static Vite SPA plus stateless
  functions. Shares the visual stack and nothing else.
