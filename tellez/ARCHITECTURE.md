# The Tellez Incident — Architecture

A simulated desktop investigation, played live in a browser during an NUSEC
meeting. Participants click around a fake computer belonging to a former club
president and work out where the money went.

**This document is the contract.** Mahir is building the foundation; other club
members extend it. If you are one of them — or an agent working for one — read
[§7 Extension points](#7-extension-points--how-to-add-anything) first. It is
written so you can add directories, files, apps, whole websites, and new portals
**without editing the engine**.

**[CHALLENGES.md](CHALLENGES.md) is the companion to this file** and the one to
read first: it lists every discovery that already exists, what it asks of a
player, and every answer. This file says how to build; that file says what has
been built.

**Status:** engine built and walked end to end · content: the five discoveries below
**Branch:** `tellez-incident` · **App root:** `tellez/` · **Never merges to `main`.**
**Event:** Tuesday 2026-09-29. · **Running it:** [README.md](README.md)

---

## 1. What this is

A locked Windows-shaped desktop loads in the browser. Participants find the
credentials, get in, and explore a fake filesystem — documents, a recycle bin,
a working web browser with its own fake internet — assembling the story of how
Alec Tellez moved club funds.

**There are no flags and nothing to submit.** Progress is recorded implicitly:
opening the right file *is* the achievement. The only things a participant ever
types are in-world credentials. A facilitator board on the projector shows, live,
where all ~40 people are.

### What it is not

- **Not a VM, container, or emulator.** Nothing executes. It is a data-driven UI
  over a fake tree.
- **Not a window manager.** Two regions: the File Explorer, and one visible
  application chosen from the taskbar. See [§6](#6-the-shell-and-the-two-region-rule).
- **Not a CTF.** No `NUSEC{...}`, no submission box, no participant scoreboard.
- **Not linear.** There are no acts, chapters or levels. It is one machine with
  things hidden in it, and a dependency graph of what unlocks what.

---

## 2. Decisions already made

Settled 2026-09-26. Reopen deliberately, not by accident.

| Question | Decision |
|---|---|
| Host | **Vercel**, second project, Root Directory `tellez/` |
| Live state | **Neon Postgres** via Vercel Marketplace, HTTP serverless driver |
| Realtime | **Polling** — facilitator board every 2s. No WebSockets. |
| Code location | Branch `tellez-incident` on `NUSecurity/NUSEC`, app under `tellez/` |
| Identity | Display name → signed **httpOnly cookie**. No password, no email. |
| Content gate | **Server-side.** A locked path returns `403`. |
| Repo visibility | Public, and **that is accepted** — participants are trusted to act in good faith. No private submodule. |
| Look | Fictional OS ("HuskyOS"), Windows-shaped, original icons only |
| Suspect | **Alec Tellez**, former NUSEC president — real person, participating, fiction built around the name |
| Structure | **Non-linear.** Content modules, not acts. |
| Scale | ~40 concurrent |

### 2.1 Why Vercel works here when it didn't for the escape room

The escape room (`~/School/Clubs/NUSEC/escape-room`) is an Express + `ws`
container on Render, because its gate requires the **server to push to players**:
your door opens the moment enough teammates finish, with no reload. A serverless
function cannot hold a socket, so Vercel was out.

This app has no player-to-player synchronisation. Live data flows one direction —
participant clicks a file, server records it, facilitator board reads it. That is
ordinary request/response plus one polling dashboard.

**Capacity:** 40 people × ~300 interactions ≈ 12,000 invocations against a
1,000,000/month Hobby allowance. Capacity is a non-issue; the limits that
actually bite are in [§9.3](#93-the-four-vercel-limits-that-will-bite-you).

### 2.2 Why content is still server-side on a public repo

Good faith is assumed, so we are not hiding the repo. Server-gating is kept
anyway, for a reason that has nothing to do with cheating:

**The shape of the filesystem is the puzzle.** If the tree ships in the bundle,
the File Explorer can render every folder instantly — including the ones nobody
has earned — and the discovery is gone for everyone, not just the curious. The
gate exists so that "there is a folder here you have not found yet" stays true.

It is also what makes credentials work at all. `hellohackers` is checked on the
server; the browser never holds anything to compare against.

---

## 3. Stack

```
Client   React 18 + TypeScript + Vite + Tailwind      (matches the main site)
Server   Vercel serverless functions, Node 20, TypeScript, under tellez/api/
Data     Neon Postgres, @neondatabase/serverless (HTTP — no pooling needed)
Auth     Signed httpOnly cookie, HMAC-SHA256
Deploy   Vercel project #2, Root Directory tellez/, domain tellez.nusec.club
```

### 3.1 Why a cookie and not a bearer token

Gated *binary* assets — an image, a PDF, Alec's video — are fetched by the
browser following a plain `<a href>` or `<img src>`. Those requests cannot carry
an `Authorization` header. A cookie rides along automatically. Same reasoning as
the escape room, same conclusion.

Cookie is `HttpOnly`, `Secure`, `SameSite=Lax`, holding `sessionId.hmac` signed
with `SESSION_SECRET`.

### 3.2 Why Postgres, not Redis or in-memory

The event log **is the deliverable** — knowing where everyone is, live and
afterwards. Postgres makes that queryable for free.

It also fixes the escape room's documented weakness: in-memory state is lost on
redeploy, so you must not ship during a meeting. Postgres survives deploys, so a
mid-meeting hotfix is merely tense rather than catastrophic.

---

## 4. Directory layout

```
tellez/
├── ARCHITECTURE.md · README.md
├── vercel.json              Root Directory tellez/, includeFiles for assets
│
├── shared/                  the contract. Types and ids, NEVER data.
│   ├── protocol.ts
│   └── apps.ts              the app id list both sides validate against
│
├── api/                     thin serverless wrappers over server/engine.ts
│   ├── session.ts · login.ts · desktop.ts · event.ts · board.ts · health.ts
│   ├── fs/list.ts · fs/read.ts · fs/asset.ts
│   └── web/fetch.ts · web/auth.ts
│
├── server/                  server-only. NEVER imported by client code.
│   ├── content/
│   │   ├── modules/         ← EVERYTHING AUTHORS WRITE LIVES HERE
│   │   │   ├── 00-workstation.ts     the machine: tree, desktop, clutter
│   │   │   ├── 10-login.ts           the lock screen credentials
│   │   │   ├── 20-recycle-bin.ts     fifteen deleted files
│   │   │   ├── 30-desktop-notes.ts   fourteen personal notes
│   │   │   ├── 40-brightline.ts      the vendor portal
│   │   │   └── index.ts              the module registry
│   │   ├── assets/          binary/SVG assets under ~4 MB
│   │   ├── kit.ts           the single import for authoring
│   │   └── machine.ts       facts the engine and content both need
│   ├── types.ts             ContentModule, Objective, Secret, SimSite
│   ├── vfs.ts               the node class hierarchy and its builders
│   ├── locks.ts             lock rules — PURE, no I/O
│   ├── objectives.ts        triggers and progress derivation — PURE
│   ├── world.ts             merges modules; refuses collisions
│   ├── engine.ts            the service layer; every gate decision lives here
│   ├── guard.ts             requireSession / requireMachine
│   ├── session.ts           cookie signing
│   ├── db.ts                Neon in production, JSON file in development
│   ├── http.ts              the req/res shape shared by Vercel and the dev shim
│   └── preflight.ts         content validation
│
├── client/src/
│   ├── shell/               Desktop · Taskbar · StartMenu · Window
│   │   ├── LockScreen.tsx · Toasts.tsx
│   │   └── ErrorBoundary.tsx    one broken viewer must not white-screen the room
│   ├── apps/                one file per viewer, all listed in registry.ts
│   ├── sites/               the simulated internet's renderers
│   ├── lib/                 api · telemetry · icon
│   └── pages/               Join · Play · Board
│
└── scripts/preflight.ts
```

**The one rule that keeps the gate honest:** nothing in `client/` may import from
`server/`. Only `shared/protocol.ts` crosses the line, and it holds types, never
data. A build-time check enforces this.

---

## 5. The object model

Designed so that adding content means **adding data, not editing the engine**.

### 5.1 The virtual filesystem

```ts
abstract class VfsNode {
  path: string;            // canonical, "C:/Users/atellez/Documents"
  name: string;            // derived
  meta: NodeMeta;
  lock: LockRule;          // AlwaysOpen unless stated
  visibility: Visibility;  // "listed" (default) | "concealed"
  reveals: ObjectiveId[];  // objectives satisfied by opening this
  abstract kind: NodeKind;
}

class Directory extends VfsNode { kind = "dir" }

abstract class FileNode extends VfsNode { abstract opensWith: AppId }

class TextFile      extends FileNode { body: string }
class SheetFile     extends FileNode { columns: string[]; rows: Cell[][] }
class MailArchive   extends FileNode { messages: MailMessage[] }
class ChatLog       extends FileNode { messages: ChatMessage[] }
class ImageFile     extends FileNode { asset: AssetRef; exif?: ExifBlock }
class VideoFile     extends FileNode { asset: AssetRef; poster?: AssetRef }
class ArchiveFile   extends FileNode { entries: VfsNode[]; passphrase?: SecretId }
class EncryptedFile extends FileNode { cipher: string; passphrase: SecretId }
class ShortcutFile  extends FileNode { target: string }   // to a path OR a URL
class BinaryFile    extends FileNode { hexPreview: string }
```

**`visibility` is the field that makes a discovery a discovery.** A `concealed`
node is omitted from its parent's listing until its lock opens, and a request
for it answers **404, not 403** — answering "forbidden" would confirm the path
exists, turning path-guessing into a reliable way to map every secret in the
game without finding any of them. A `listed` node is always visible and refuses
on open; use it sparingly, because a padlock in a file listing is a treasure map.

`NodeMeta` is **puzzle material, not decoration**:

```ts
interface NodeMeta {
  createdAt: number; modifiedAt: number; accessedAt: number;
  sizeBytes: number;
  attributes: ("hidden" | "system" | "readonly" | "encrypted")[];
  deleted?: { at: number; originalPath: string };   // recycle bin semantics
  owner?: string;
}
```

Two details authors should exploit:

- **`attributes: ["hidden"]`** hides a node until the session toggles *Show
  hidden items* in the File Explorer. That toggle is itself an objective — it is
  a real investigative habit worth teaching.
- **`deleted.originalPath`** is how a recycle bin item tells you about a folder
  you have not found. Deleted ≠ gone, and the deletion record is evidence.

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
  moduleId: ModuleId;
  title: string;          // shown on the facilitator board
  note?: string;          // what it means when it lights up — WRITE THIS
  hidden?: boolean;       // participants never learn it exists
  trigger:
    | { on: "open";      path: string }
    | { on: "secret";    id: SecretId }
    | { on: "appAction"; app: AppId; action: string }
    | { on: "visit";     host: string; path?: string }
    | { on: "all";       objectives: ObjectiveId[] };
}
```

```ts
interface Secret {
  id: SecretId;
  value: string;               // the accepted answer
  env?: string;                // optional override, e.g. "SECRET_PORTAL_PW"
  normalise?: ("trim" | "lower" | "alnum")[];   // default: ["trim"]
  hints?: string[];            // facilitator can release these from /board
}
```

Secret values live in the module file. Since the repo is public and good faith is
assumed, env-var indirection buys nothing and costs every author a Vercel
round-trip — so `env` exists as an escape hatch and is not the default. `value`
is still never sent to the client; comparison happens in the function.

**This is what "no flags" means in practice.** `{ on: "open" }` triggers fire
implicitly from reading a file. The only typed input in the whole game is
something a person on that machine would actually have typed.

### 5.3 The simulated internet

The Browser app is a first-class extension surface, because it is how OSINT
challenges, second portals, and fake corporate sites get built.

```ts
interface SimSite {
  host: string;                 // "ledger.brightlinepay.test"
  title: string;
  favicon?: IconName;
  discoverable?: boolean;       // true = appears in the sim search engine
  routes: SimRoute[];
  auth?: SiteAuth;              // present = the site has a login wall
}

interface SimRoute {
  path: string;                 // "/" · "/invoices" · "/invoices/:id"
  lock?: LockRule;              // optional, per-route
  reveals?: ObjectiveId[];
  render(ctx: SiteContext): JSX.Element;
}

interface SiteAuth {
  usernameSecret: SecretId;
  passwordSecret: SecretId;
  reveals: ObjectiveId[];       // fired on successful login
  protects: string[];           // route paths behind the wall
}
```

> **Fake hostnames must use a reserved TLD — `.test`, `.invalid` or
> `.example`.** This is not a style preference. If you invent
> `tellezholdings.com` and that turns out to be a real company, you have pointed
> forty people with a security mindset at a stranger's website. Reserved TLDs
> cannot resolve, so this cannot happen.

A site's *data* lives in a content module; its *renderer* lives in
`client/src/sites/`. Route rendering is client-side, but **gated routes and all
auth checks go through the server** (`/api/web/fetch`, `/api/web/auth`), exactly
like the filesystem.

### 5.4 Sessions and telemetry

```ts
interface Session { id: string; displayName: string; startedAt: number; lastSeenAt: number }

interface Event {
  id: string; sessionId: string; at: number;
  type: "session.start" | "login.attempt" | "node.open"  | "node.denied"
      | "app.launch"    | "secret.submit" | "web.visit"  | "web.auth"
      | "objective.reached" | "app.action" | "search.query";
  payload: Record<string, unknown>;
}
```

The event table is **append-only** — on theme, and also the correct shape for an
audit log. Progress is *derived* from events rather than stored beside them, so
there is one source of truth and replaying the log reproduces the same state.

Client batches events, flushing every 2s or at 10 queued, using
`fetch(..., { keepalive: true })` so a closing tab still reports. Failed flushes
are dropped, never retried into an unbounded queue — telemetry must never be
able to degrade the experience.

### 5.5 Content modules — the authoring unit

```ts
interface ContentModule {
  id: ModuleId;
  title: string;
  summary: string;              // facilitator-facing: what players do here
  nodes?: VfsNode[];
  objectives?: Objective[];
  secrets?: Secret[];
  sites?: SimSite[];
  desktopItems?: DesktopItem[];  // icons on the desktop
  startMenuItems?: StartMenuItem[];
  requiresApps?: AppId[];        // fails preflight if the app isn't registered
}
```

**The world is the merge of every module.** Modules are additive overlays onto
one shared machine, which is what lets several people build in parallel without
touching each other's files. Two modules declaring the same path or host is a
**build failure**, not silent last-writer-wins.

There is no ordering between modules. Numeric filename prefixes are for human
scanning only; the engine does not read them.

---

## 6. The shell and the two-region rule

There is no window manager and there must never be one. The screen has exactly
two regions:

```ts
class DesktopShell {
  explorerSlot: Slot | null;   // the File Explorer, or the Recycle Bin
  apps: Slot[];                // several open at once
  activeApp: string | null;    // exactly one of them on screen
}
```

**Several applications may be open; exactly one is shown.** The open ones all
appear in the taskbar, and clicking one brings it forward. There is still no
z-order, no dragging, no resizing and no free-floating geometry — a taskbar
button is a radio control, not a window.

**One instance per application id.** Opening a second text file replaces what
the text viewer is showing rather than stacking a second copy of it. That is
how a single-document viewer behaves, and it keeps the taskbar honest.

> ### The rule that makes this work
>
> **Inactive apps are hidden with CSS, never unmounted.**
>
> Unmounting throws away component state, and that state is the entire point:
> the browser has to remember the page it was on, a viewer has to remember what
> it was showing. The bug this design exists to fix was reading the portal note,
> opening the browser to visit the address it gives you, and coming back to find
> the note — and the base64 username on it — gone.
>
> An app that holds internal state gets this for free. If you "optimise" the
> render to unmount hidden windows you break every app at once, and the symptom
> looks like content randomly resetting rather than like a rendering change.

> **To contributors and their agents:** you will be tempted to generalise this
> into a real window manager. Do not. The constraint is the feature, and it is
> the single biggest reason this was affordable to build.

## 7. Extension points — how to add anything

This is the section to read if you are adding to the investigation. Every recipe
below is **new files plus one registry line**. None of them require touching the
engine. If you find yourself editing `server/world.ts` or `client/src/shell/`,
stop — you have probably found a missing extension point, and adding one
properly is better than working around it.

After any change, run:

```bash
npm run preflight
```

### 7.1 Add files and folders

Create `server/content/modules/NN-your-thing.ts`:

```ts
export const yourThing: ContentModule = {
  id: "your-thing",
  title: "The Thing",
  summary: "Players find X by doing Y.",   // the facilitator reads this live
  nodes: [
    dir("C:/Users/atellez/Documents/Vendors"),
    text("C:/Users/atellez/Documents/Vendors/invoice-0042.txt", {
      body: "...",
      meta: { modifiedAt: ts("2025-11-03T02:14:00") },
      reveals: ["vendor-invoice-seen"],
    }),
  ],
  objectives: [
    { id: "vendor-invoice-seen", moduleId: "your-thing",
      title: "Opened the fake vendor invoice",
      note: "They're on the payment trail.",
      trigger: { on: "open", path: "C:/Users/atellez/Documents/Vendors/invoice-0042.txt" } },
  ],
};
```

Register it in `server/content/modules/index.ts`. Done.

### 7.2 Add a desktop icon or Start menu entry

```ts
desktopItems:   [{ label: "Budget 2025", icon: "FileSpreadsheet",
                   target: "C:/Users/atellez/Desktop/budget-2025.xlsx" }],
startMenuItems: [{ label: "Calculator", appId: "calculator" }],
```

### 7.3 Add a new application

Three steps: the file, its id in `shared/apps.ts`, and a line in
`client/src/apps/registry.ts`.

```ts
// client/src/apps/HexEditor.tsx
export const hexEditor: DesktopApp = {
  id: "hex-editor",
  title: "Hex Editor",
  icon: "Binary",                  // Lucide name — no Microsoft assets, ever
  opens: ["binary"],               // which NodeKinds it claims
  render({ node, content, shell, emit }) { /* ... */ },
};
```

The id must be in `shared/apps.ts` first. The registry is typed
`Record<KnownAppId, DesktopApp>`, so a half-registered app is a **compile
error** rather than a blank window during a meeting, and preflight refuses any
node whose `opensWith` is not on that list.

An app is a **viewer**: it renders what the server sent and emits events. It
never decides whether something is unlocked — that answer only ever arrives as
content or as a `403`.

**`slot`.** An app defaults to the app slot. Set `slot: "explorer"` if your app
*browses* the filesystem, so that opening a file from it leaves it on screen
instead of replacing it — that is why the File Explorer and the Recycle Bin both
claim the explorer slot. This is not a third window; it is getting the existing
two right.

### 7.4 Add a new file type

1. Add the class to `server/vfs.ts` extending `FileNode` with `opensWith`.
2. Add the kind to the `NodeKind` union in `shared/protocol.ts`.
3. Build the viewer app ([§7.3](#73-add-a-new-application)) declaring it in `opens`.

Preflight fails if a node's kind has no registered viewer.

### 7.5 Add a website to the simulated internet

Data in your content module:

```ts
sites: [{
  host: "nushacks-alumni.test",
  title: "NU Hacks — Alumni Directory",
  discoverable: true,                     // findable via the sim search engine
  routes: [
    { path: "/",             render: AlumniIndex },
    { path: "/member/:slug", render: AlumniProfile,
      reveals: ["alumni-profile-viewed"] },
  ],
}],
```

Renderers in `client/src/sites/nushacks-alumni/`, registered in
`client/src/sites/registry.ts`.

> **A renderer is a React component, not a function you call.** It receives
> `SiteContext` as its props and is rendered `<Renderer {...ctx} />`. Use hooks
> in it freely — but never invoke another renderer by hand as `Other(ctx)`:
> that attributes its hooks to the browser component, and the first renderer
> using `useState` takes the whole desktop down with "rendered more hooks than
> during the previous render". Both window slots sit behind an error boundary
> so a crash costs one window rather than the meeting, but the boundary is a
> net, not a licence.

**This is the OSINT extension point.** A fake search engine, social profiles,
a company "about us", a pastebin clone, a leaked-credential dump — all of it is
just sites with `discoverable: true` and no lock. Server-gating still applies to
any route with a `lock`, so an OSINT trail and a locked portal can coexist on
the same fake internet.

### 7.6 Add a portal (a site with a login wall)

A portal is a site with `auth`. Nothing else is special about it.

```ts
secrets: [
  { id: "vendor-portal-user", value: "billing.ops" },
  { id: "vendor-portal-pw",   value: "..." },
],
sites: [{
  host: "vendors.brightlinepay.test",
  title: "BrightLine Vendor Portal",
  auth: {
    usernameSecret: "vendor-portal-user",
    passwordSecret: "vendor-portal-pw",
    reveals: ["vendor-portal-breached"],
    protects: ["/dashboard", "/payouts"],
  },
  routes: [
    { path: "/",         render: VendorLogin },
    { path: "/dashboard",render: VendorDashboard },
    { path: "/payouts",  render: VendorPayouts, reveals: ["payouts-seen"] },
  ],
}],
```

Credentials are checked at `/api/web/auth` and the protected routes are never
sent to an unauthenticated session. **Build as many portals as you like** — the
engine has no notion of "the" portal.

### 7.7 What preflight checks

`npm run preflight` fails the build on:

- two modules declaring the same path, host, objective id, or secret id
- a `LockRule` referencing an objective or secret that does not exist
- an objective whose trigger path/host does not exist
- a node whose `kind` has no registered viewer app
- a `requiresApps` entry that is not registered
- a declared asset missing from the build
- a node unreachable from any directory — an orphan nobody can ever find
- a site route with a `lock` but no reachable way to satisfy it

This is lifted from the escape room's preflight, which exists because every one
of these failures is otherwise **completely silent until somebody hits it
mid-meeting**.

### 7.8 Rules that are not negotiable

- **No content in the client bundle.** If a participant can read it before
  earning it, it is broken.
- **No third region.** See [§6](#6-the-shell-and-the-two-region-rule).
- **No `NUSEC{...}` anywhere.** There are no flags.
- **No progress ever reaches the player.** No toasts, no checklists, no
  objective ids on the wire. Objectives exist for the facilitator board alone,
  and that has to hold in the network tab, not just on screen — this audience
  reads it. API responses deliberately carry no `revealed` field, `/api/desktop`
  carries no objective catalogue, and `/api/session` carries no progress.
- **Fake hostnames use reserved TLDs.** See [§5.3](#53-the-simulated-internet).
- **Original icons only** (Lucide or CSS-drawn). No Microsoft assets.
- **Every lock must have a discoverable path to opening it, inside the game.**
  Preflight cannot check this. Walk your own content cold and prove it.
- **Write the `note` on every objective.** Somebody is reading the board live
  and needs to know what it means when your objective lights up.

### 7.9 Design guidance

Make the evidence do the teaching. A timestamp that contradicts a story, a
`deleted.originalPath` pointing at a folder nobody found, a passphrase sitting
in a chat log three folders away — these teach real investigative habits. A
password taped under a keyboard teaches nothing.

Assume every participant is technical. They will try `..` in paths, read the
network tab, and guess hostnames. The server is the only thing between them and
the ending; rely on nothing else.

---

## 8. The content that ships in the foundation

Five discoveries, non-linear except where noted. Everything except the desktop
credentials is a **proposal — change the values freely.**

### Discovery 1 — Getting in

The lock screen shows user `atellez` on HuskyOS. The credentials are:

```
username   ultimateguitar
password   hellohackers
```

**The clue lives outside the app, in the real NUSEC Discord.** Alec's old
messages there are the source; players search their own club history to find how
he signed off and what he called himself. This is genuine OSINT and it costs
nothing to build.

*Ops requirement:* those messages must actually be findable before Tuesday, and
anyone not in the Discord needs a way in. See [§11](#11-run-of-show).

Objectives: `login-attempted` (hidden — shows who is trying vs. stuck) ·
`desktop-unlocked`.

Everything else is behind `RequiresObjective("desktop-unlocked")`.

### Discovery 2 — The recycle bin

The Recycle Bin holds roughly fifteen deleted items: old drafts, a meeting
agenda, some photos, a half-finished budget. Most are noise, several are
mild red herrings, and each carries a real `deleted.originalPath` so the bin
doubles as a map of folders that no longer appear in the tree.

`notes-to-self.txt` holds the **portal address and the base64 username**, plus
the only pointer to Discovery 4 — "pw is in the usual place, with the songs".
`passwords.txt.bak` is a pure decoy of dead 2019 credentials, and one item is
hidden, so only players who turn on *Show hidden items* see all fifteen.

Objectives: `recycle-bin-opened` · `decoy-opened` (hidden — shows who is
thorough) · `portal-link-found`.

### Discovery 3 — The portal username

Alongside the portal link is a base64 string. Players decode it externally
(CyberChef, base64decode.org — the point is that they reach for a real tool):

```
YXRlbGxlei5hZG1pbg==   →   atellez.admin
```

There is no objective for the decode itself — it happens off-site and we cannot
see it. It shows up on the board as `portal-breached` when the credential is
used.

### Discovery 4 — The portal password

`C:/Users/atellez/Desktop/notes/` holds fourteen scrappy `.txt` files: grocery
lists, setlists, chord sketches, gym splits, things to cancel. Players preview
them one by one in Notepad. `tuning-notes.txt` ends with the portal password in
a parenthesis — `dadgad-capo2`, an alternate guitar tuning and how he capos the
second song, which ties the answer back to `ultimateguitar` without being
guessable from it.

This rewards thoroughness rather than cleverness, which is a deliberate change
of pace between two inference puzzles.

Objectives: `notes-folder-opened` · `password-note-opened` · a per-file count so
the board can show **how many notes each person has read** — the single best
signal of who is stuck versus who is grinding.

### Discovery 5 — The portal

`ledger.brightlinepay.test`, opened in the Browser app inside the desktop, with
a login wall taking `atellez.admin` and the password from Discovery 4. Behind
it: the payment trail. This is where the other builders pick up.

Objectives: `portal-visited` · `portal-breached` · `payout-ledger-seen` ·
`case-assembled`, which is a composite: it fires by itself the moment a session
holds the machine unlock, the note, the password and the ledger. Nothing
triggers it directly — it is the worked example of the `{ on: "all" }` trigger.

### What is deliberately left open

The story past the portal is unwritten, and so is everything on the fake
internet beyond this one host. **Alec's video, if he records one, belongs
late** — it is the strongest single asset available and should pay off the
investigation rather than open it.

---

## 9. Deployment

### 9.1 Vercel setup

| Setting | Value |
|---|---|
| Root Directory | `tellez/` |
| Production Branch | `tellez-incident` |
| Framework Preset | Vite |
| Domain | `tellez.nusec.club` (CNAME → Vercel) |

The apex `nusec.club` keeps serving the existing site from project #1. Root
Directory means this project cannot see or break the main site.

### 9.2 Environment variables

```
DATABASE_URL            Neon connection string (Vercel Marketplace sets this)
SESSION_SECRET          random 32+ bytes; signs the session cookie
FACILITATOR_PASSWORD    gates /board. UNSET IN PRODUCTION = BOARD CLOSED.
```

All three are **required in production and all three have working fallbacks in
development**, which is why `npm run dev` needs no setup at all. Failing closed
on `FACILITATOR_PASSWORD` is deliberate, carried over from the escape room.
Challenge secrets live in module files ([§5.2](#52-locks-objectives-secrets)),
not here.

`GET /api/health` reports all three as booleans and answers **503** with a named
problem if any is missing in production. That endpoint is the pre-meeting check;
see [README.md](README.md) for the run of show.

### 9.3 The four Vercel limits that will bite you

1. **4.5 MB function response limit.** Gated binaries stream through
   `api/fs/asset.ts`, so nothing larger can pass the gate.
2. **Large media — Alec's video — needs different handling.** It will exceed
   both that and the 50 MB bundle limit. Put it in Vercel Blob (or `public/`
   under a random 32-char filename) and gate the *URL* rather than the bytes.
   Do not let this exception spread to anything that fits under 4.5 MB.
3. **`includeFiles` is required.** Serverless bundles exclude files not
   statically imported. `vercel.json` declares
   `functions: { "api/fs/asset.ts": { includeFiles: "server/content/assets/**" } }`
   or assets 404 in production while working perfectly in dev. Relatedly,
   `server/assets.ts` locates that directory by trying candidates rather than
   trusting `process.cwd()`, and runtime preflight does not check the
   filesystem at all — a missing asset already failed the build, and re-checking
   from inside a function only risks the board reporting a phantom problem.
4. **Neon free tier auto-suspends after ~5 minutes idle.** First query after a
   quiet spell pays ~500 ms. **Hit `/api/health` before the room starts** so
   participant number one is not the one who wakes the database.

### 9.4 What survives what

| Event | Outcome |
|---|---|
| Function cold start | Fine. Everything is in Postgres. |
| Redeploy mid-meeting | **Sessions and progress survive.** Unlike the escape room. |
| Participant closes tab | Cookie persists; reopening resumes the same session. |
| Participant clears cookies | New session, progress orphaned. Board can re-link by name. |

---

## 10. The facilitator board

`/board`, password-gated, unlisted, **never linked from the participant UI**.
Polls `GET /api/board` every 2s and shows:

- every session, display name, objectives reached, last-seen
- **a per-objective completion count** — this is how you spot a stuck room
- notes-read count per person (see [Discovery 4](#discovery-4--the-portal-password))
- a live event ticker
- the preflight result
- hint release: push a `Secret.hints` entry to everyone

Polling, not push. One dashboard, one endpoint, every 2s for ninety minutes is
~2,700 requests. Supabase Realtime or SSE would buy nothing.

---

## 11. Run of show

Before Tuesday 2026-09-29:

1. **Confirm Alec's Discord messages are findable.** Discovery 1 is entirely
   dependent on this and it is the one piece the app cannot provide. If the
   messages do not exist, Alec posts them beforehand.
2. **Decide the fallback for anyone not in the Discord** — a projected
   screenshot, or a facilitator hint released from `/board`.
3. Set env vars in Vercel; confirm `/board` opens.
4. `npm run preflight` against production content.
5. **Hit `/api/health`** to wake Neon.
6. Walk the whole thing cold on a phone and on a laptop.

---

## 12. Open questions

1. **Discord dependency.** Items 1 and 2 above — the only hard external
   dependency in the build.
2. **Portal password value.** Discovery 4 needs a chosen string. Something
   guitar-adjacent ties it to `ultimateguitar` without being guessable.
3. **OS name.** Placeholder **HuskyOS**. One constant.
4. **Post-event.** Leave it up as a recruiting demo, or take it down? Affects
   whether the board and event log stay reachable.

---

## 13. Related work in this org

- **`~/School/Clubs/NUSEC/escape-room`** — the team-versus-team escape room.
  Different problem (needs real push, hence Render), but the patterns for
  server-gated content, the facilitator console and content preflight came from
  there. Read its README.
- **`NUSecurity/NUSEC` `main`** — the club site. Static Vite SPA plus stateless
  functions. Shares the visual stack and nothing else.
