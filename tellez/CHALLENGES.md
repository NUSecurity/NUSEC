# Challenges — the register

Every discovery in The Tellez Incident, what it asks of a player, and how it is
wired up. **This file contains every answer.** It is for the people building and
running the event, not for participants.

If you are adding a challenge, add it here in the same shape. This is the map —
without it, three people authoring one filesystem will collide, duplicate each
other's ideas, or build something unreachable.

- **New here:** [START-HERE.md](START-HERE.md)
- **How to build one:** [ARCHITECTURE.md §7](ARCHITECTURE.md#7-extension-points--how-to-add-anything)
- **How to run the event:** [README.md](README.md)
- **Check your work:** `npm run preflight` then `npm run walk`

---

## The map

| # | Challenge | Module | Needs | Board markers |
|---|---|---|---|---|
| 0 | [The Workstation](#0--the-workstation-not-a-challenge) | `00-workstation.ts` | — | *(none — furniture)* |
| 1 | [Getting In](#1--getting-in) | `10-login.ts` | — | `desktop-unlocked` |
| 2 | [What He Threw Away](#2--what-he-threw-away) | `20-recycle-bin.ts` | 1 | `recycle-bin-opened` · `portal-link-found` · `decoy-opened` |
| 3 | [The Encoded Username](#3--the-encoded-username) | `20-recycle-bin.ts` | 2 | *(none — see below)* |
| 4 | [With The Songs](#4--with-the-songs) | `30-desktop-notes.ts` | 2 | `notes-folder-opened` · `password-note-opened` |
| 5 | [The Vendor Console](#5--the-vendor-console) | `40-brightline.ts` | 3 + 4 | `portal-visited` · `portal-breached` · `payout-ledger-seen` · `case-assembled` |
| 6 | [Classified](#6--classified) | `50-classified.ts` | 5 | `classified-password` · `classified-approved` · `classified-unlocked` · `jessica-transfers-seen` · `scheme-documents-read` · `message-log-read` |

**Everything is behind challenge 1.** Until a session has `desktop-unlocked`,
the server refuses every filesystem and web request — a locked machine serves no
bytes at all.

3 and 4 can be done in either order. This is a dependency graph, not a sequence.

```
  1 Getting In
       │
       └──> 2 Recycle Bin ──┬──> 3 Encoded username ──┐
                            │                          ├──> 5 Vendor console ──> 6 Classified
                            └──> 4 Notes folder ───────┘
```

---

## 0 · The Workstation *(not a challenge)*

**Module:** `server/content/modules/00-workstation.ts` · **Status:** live

Not a puzzle. This module owns the directory skeleton — `C:`, `C:/Users`,
`C:/Users/atellez` and its Desktop, Documents, Downloads and Pictures — plus the
desktop icons, the Start menu, and the ordinary clutter a real user leaves
behind: a club laptop readme, a transition checklist, a signed-off budget, a
treasurer email thread, a `Thumbs.db` marked hidden, and a joke
`C:/Windows/System32/registry-hives.txt` for anyone who wanders outside the
user folder — it asks them to imagine the hives.

**Read this before adding files.** Those folders already exist, and a second
module declaring `C:/Users/atellez/Documents` is a build failure, not a merge.
Declare only the folders *you* introduce, and hang them off the tree that is
already here.

The clutter is doing a job. A filesystem containing only evidence tells you
exactly where the evidence is, so some of what is here exists purely to be
unremarkable. Some of it is *nearly* remarkable — the budget reconciles to the
cent, and the treasurer asks twice about vendor invoices and is fobbed off —
which rewards a player who reads everything without requiring it of them.

**Where the money came from.** The club's budget notes an anonymous alumni gift
of $2.5M, received September 2024. That gift is what Alec stole $2.4M of. The
number is deliberately absurd for a student club, so nobody in the room mistakes
the story for NUSEC's real finances. Everything else in the budget (snacks,
room bookings) stays at real club scale, and the contrast is part of the joke.

---

## 1 · Getting In

**Module:** `server/content/modules/10-login.ts` · **Status:** live

**What they're trying to find**
The credentials for Alec Tellez's workstation.

**Where it is**
The username is Alec's club account name, `atellez`, in the club's
first-initial-surname style. The password is **not on the machine** — it is the
handle Alec used in his own posts in the *real* NUSEC Discord. This is the one challenge
whose source material lives outside the app.

**The process**
A player lands on a lock screen with the username field empty and no
instructions beyond "he was not careful about where he talked about himself".
The intended move is to go and read the club's own history.

A failed attempt shows one hint for whichever half was wrong:

- Username wrong → *"First initial + last name, e.g. jsmith for John Smith"*
- Username right, password wrong → *"Discord username"*

Which hint appears confirms whether the username is right, so this is a
deliberate username oracle. On a real login that is a flaw; here it is the
feature, because a room stuck on the front door learns nothing.

**What they have to do**
Type both into the lock screen.

| | |
|---|---|
| Username | `atellez` |
| Password | `ultimateguitar` |

Both are trimmed and case-insensitive, so ` ATellez ` works.

**Board markers**
- `desktop-unlocked` — they are in.

Failed attempts are recorded too, with `userOk` noting whether the username half
was right. A person with several failures and `userOk: false` is stuck on the
username despite the naming-style hint; `userOk: true` means they have seen the
Discord hint and are hunting for his handle.

**⚠️ Before the event**
Confirm those posts are actually findable, and decide the fallback for anyone
not in the Discord — the facilitator can give the password out by hand.
**This challenge does not work if the Discord history does not cooperate.**

---

## 2 · What He Threw Away

**Module:** `server/content/modules/20-recycle-bin.ts` · **Status:** live

**What they're trying to find**
A note to self holding the address of a vendor portal, and the pointer to its
password.

**Where it is**
`C:/$Recycle.Bin/notes-to-self.txt`, one of eleven deleted files.

**The process**
The Recycle Bin is a desktop icon and a Start menu entry, so finding it is
trivial; reading all of it is not. It opens in its own view with two columns the
File Explorer does not have — **original location** and **date deleted** — so
the bin doubles as a map of folders that no longer exist. Deleted is not gone,
and the deletion record is itself evidence.

Ten items show by default. The eleventh, `desktop.ini`, is marked hidden
and appears only when a player turns on *Show hidden items* in the File
Explorer. It is not important; it is there so that habit gets rewarded once.

`passwords.txt.bak` is a pure decoy — dead 2019 credentials, clearly labelled as
such by the file itself. It exists to be opened.

**What they have to do**
Open files until they hit `notes-to-self.txt`, which reads:

```
don't leave this lying around

ledger.brightlinepay.hack   <- vendor console, not the club one

not writing the user out in plaintext, it's:

    YXRlbGxlei5hZG1pbg==

pw is in the usual place, with the songs.
```

That one file seeds challenges 3, 4 and 5.

**Board markers**
- `recycle-bin-opened` — expected within a couple of minutes.
- `portal-link-found` — they have the address and the encoded username.
- `decoy-opened` *(hidden)* — opened `passwords.txt.bak`. Tells you who reads
  everything. Players never learn this objective exists.

**Supporting content (no objectives)**
`equipment-quotes.xlsx` shows Brightline winning both line items at nearly
double the other quotes, and `IMG_2291.svg` is a whiteboard photo where someone
wrote "(why?)" next to that decision. Neither is required. They are there so
that a player who reads everything ends up *ahead* of the story rather than
merely on schedule.

---

## 3 · The Encoded Username

**Module:** `server/content/modules/20-recycle-bin.ts` · **Status:** live

**What they're trying to find**
The portal's username.

**Where it is**
In the same note as the portal address — `YXRlbGxlei5hZG1pbg==`.

**The process**
Recognise base64 by shape — the `==` padding is the tell — and decode it.

**Cipher Bench**, in the Start menu, does this in-world: paste the string, add
*From Base64*, read the output. It is a CyberChef-shaped recipe tool, so it also
covers hex, binary, URL encoding, ROT13, Caesar, Atbash, XOR and the SHA family
for whatever gets built next. Players who would rather reach for CyberChef or
`base64 -d` still can — recognising *what* the encoding is remains the lesson,
and that part is unchanged.

**What they have to do**
Decode it.

```
YXRlbGxlei5hZG1pbg==   →   atellez.admin
```

**Board markers**
None, and this is deliberate — the decode happens off-site, so there is nothing
to observe. It shows up as `portal-breached` when the credential is finally
used. If you need to know whether a specific person got this far, ask them.

---

## 4 · With The Songs

**Module:** `server/content/modules/30-desktop-notes.ts` · **Status:** live

**What they're trying to find**
The portal password.

**Where it is**
`C:/Users/atellez/Desktop/notes/tuning-notes.txt`, one of fourteen notes.

**The process**
The only pointer is one line in the recycle-bin note: *"pw is in the usual
place, with the songs."* The `notes` folder is visible on the desktop from the
moment they log in, but means nothing until they have read that line — and it is
full of setlists, chords and a tuning note, which is what "the songs" refers to.

Then it is a grind: fourteen scrappy personal files — groceries, gym splits, car
maintenance, book recommendations, a talk outline — previewed one at a time in
Notepad. Deliberately a change of pace between two inference puzzles. This one
rewards thoroughness, not cleverness.

**What they have to do**
Read notes until they hit `tuning-notes.txt`, which ends:

```
(brightline pw is dadgad-capo2 until they make me rotate it again)
```

`DADGAD` is a real alternate guitar tuning and `capo 2` is in the same file's
own bullet list, so the password is recognisable in hindsight and not guessable
in advance. It also ties back to `ultimateguitar` from challenge 1.

**What they have to do with it**
Nothing yet — it is typed at the portal in challenge 5.

**Board markers**
- `notes-folder-opened` — they took the "with the songs" hint.
- `password-note-opened` — they have both halves of the portal credential.

**Watch the counter.** The board shows a per-person count of files opened per
module, so `desktop-notes: 9` means someone is nine notes deep and grinding.
That count is the single best signal of who is stuck versus who is working.

---

## 5 · The Vendor Console

**Module:** `server/content/modules/40-brightline.ts` · **Status:** live

**What they're trying to find**
Where the money went. This is the payoff for everything above.

**Where it is**
`ledger.brightlinepay.hack`, opened in the **Web Browser** on the desktop.
There is no search engine on this machine — the address has to come from the
recycle-bin note.

**The process**
Type the address into the browser. The site's front page is a login wall. The
protected routes are never serialised to a session that has not passed it, so
reading the page source shows a login page and nothing else.

**What they have to do**

| | |
|---|---|
| Username | `atellez.admin` (decoded in challenge 3) |
| Password | `dadgad-capo2` (found in challenge 4) |

Then open **Payouts**, which shows four payments from the club arriving and the
same four amounts leaving the same day:

```
2024-11-03   NU Cybersecurity Club    $180,000   →  A.T. Consulting LLC ••••4471
2025-02-17   NU Cybersecurity Club    $340,000   →  A.T. Consulting LLC ••••4471
2025-09-22   NU Cybersecurity Club    $780,000   →  A.T. Consulting LLC ••••4471
2026-03-11   NU Cybersecurity Club  $1,100,000   →  A.T. Consulting LLC ••••4471

Received $2,400,000    Disbursed $2,400,000    Retained $0
Beneficial owner of A.T. Consulting LLC: A. TELLEZ.
```

The $180,000 and $340,000 match `equipment-quotes.xlsx` from the recycle bin
exactly, so a thorough player recognises them.

**Board markers**
- `portal-visited` — they typed the address. Credentials are the next wall.
- `portal-breached` — both halves found and used.
- `payout-ledger-seen` — they have the actual answer.
- `case-assembled` — composite. Fires by itself once a session holds
  `desktop-unlocked`, `portal-link-found`, `password-note-opened` and
  `payout-ledger-seen`. Nothing triggers it directly; it is the worked example
  of the `{ on: "all" }` trigger.

---

## 6 · Classified

**Module:** `server/content/modules/50-classified.ts` · **Status:** live

**What they're trying to find**
Where the money went after Alec's LLC, and who was in it with him.

**Where it is**
A **Classified** tab in the vendor console's menu bar, next to Payouts, at
`ledger.brightlinepay.hack/classified`. The route belongs to this module; it is
added to the portal as a *site challenge*, so it sits behind the portal login
as well as its own gate.

**The process**
Three factors, strictly in order. The page only ever shows the current step,
and nothing about a later step reaches the browser before the earlier one is
passed.

1. **The password again.** Same as the portal: `dadgad-capo2`.
2. **An Authenticator push.** The page says a sign-in request was sent to the
   Authenticator app and waits. **Authenticator** is on the desktop and in the
   Start menu from the moment the machine unlocks, showing "No pending
   requests" until now. The request shows up there with **Approve** and
   **Deny**. Approve moves the page on by itself. Deny sends the whole gate back
   to step 1 with a "request was denied" notice.
3. **Three security questions**, all answered at once. A wrong set says only
   "One or more answers were incorrect" — never which one.

| Question | Answer | Where it is |
|---|---|---|
| What day do you hit legs? | `thursday` (also `thu`, `thur`, `thurs`) | `notes/gym.txt` — `thu  legs` |
| What is your favorite book? | `the cuckoo's egg` (also `cuckoo's egg`) | `notes/book-recs.txt` — "(reread, still my favorite)" |
| Who was the treasurer of NUSEC in 2025? | `Arjun Uppal` — **full name only** | Not written down on the machine |

Every answer ignores case and surrounding spaces; the book and the treasurer
also ignore punctuation and inner spacing, so `Cuckoos Egg` and `arjun uppal`
both work.

**The treasurer question is deliberate OSINT.** Nothing on the machine names
him. The treasurer email thread in `Documents/NUSEC/` comes from
`a.uppal@nusec.club`, which gives an initial and a surname and no more, and
`elections-2026-notes.txt` in the recycle bin mentions that the treasurer
volunteered as returning officer. The full name comes from the club's own
history, the same way the lock-screen password comes from Discord.

**It re-locks.** Passing the three factors opens Classified for one visit.
Moving between its own pages (Transfers, Documents, Messages) keeps it open.
Loading any other page, or ten minutes without opening a Classified page,
locks it again, and the next visit costs all three factors. The board markers
stay lit; only the player's access resets.

**What's behind the gate**
Three pages, each its own route, so the board can tell them apart:

- **Transfers** (`/classified`) — the next hop after the payout ledger. Two days
  after each payout, A.T. Consulting LLC ••••4471 forwarded the same amount to
  **Jessica James Okafor** ••••9920, all $2.4 million of it, under a standing
  instruction. References match the invoice numbers.
- **Documents** (`/classified/documents`) — Alec's own paperwork: the standing
  instruction naming Jessica as beneficiary, a note on how the three-quotes rule
  was gamed, what each invoice was really for (nothing was ever bought), and
  his exit checklist.
- **Messages** (`/classified/messages`) — an exported chat between Alec and
  Jessica, his accomplice, from opening the Brightline account in October 2024
  to her leaving in June 2026. It ends:

  > **Jessica:** I'm done here. I'm going to travel for a while. Somewhere
  > nobody asks about invoices.
  > **Alec:** where??
  > **Jessica:** Not over this. It's on my Instagram.

**The next step leaves the machine.** Jessica is fictional, but her Instagram
account is real and exists for this exercise. Searching her full name,
Jessica James Okafor, on Instagram finds it. Nothing in the game builds or
links to it.

The chat is built to agree with what players have already seen. The payout
dates, the equipment quotes, the treasurer's 2026-04-28 email, the resignation
draft ("don't mention the vendor"), `things-to-cancel.txt` ("vendor console —
NOT this one yet") and the notes deleted on 2026-06-02 all line up with it.
Jessica's last line, "You first", is why the thread still exists.

**Board markers**
- `classified-password` — past factor one. Watch for people who never open the
  Authenticator after this.
- `classified-approved` — past factor two. Now the questions.
- `classified-unlocked` — all three factors passed.
- `jessica-transfers-seen` — they have the last hop: the money went to Jessica.
- `scheme-documents-read` — optional depth.
- `message-log-read` — they have the pointer to her Instagram. Anyone past this
  is working off the machine.

Failed attempts at any step count toward `failedChallengeSteps` on the board,
and a failed question attempt records which answers were wrong — visible in the
event log, never to the player.

**⚠️ Before the event**
Decide whether the room can reach the treasurer's name. If not, the
facilitator can read `hints[1]` of `classified-treasurer` aloud.

---

## Not yet built

The investigation inside the game ends at the message log, which sends players
to Jessica's real Instagram. Everything below is open, and the engine already
supports all of it without engine changes.

- **Alec's video.** If he records one, it belongs **late** — it is the strongest
  single asset available and should pay off the investigation, not open it. Use
  a `VideoFile`; the URL is gated rather than the bytes, because video exceeds
  Vercel's 4.5 MB response cap.
- **OSINT.** The browser takes any number of sites. A fake alumni directory,
  a company registry listing A.T. Consulting, a pastebin clone. Mark them
  `discoverable: true` and they become findable.
- **More portals.** A portal is just a site with an `auth` block. There is no
  "the" portal.
- **Mail and chat logs.** `MailArchive` and `ChatLog` are built and have viewers,
  but only one `.eml` exists so far.
- **An encrypted archive.** `ArchiveFile` with a `passphrase` lists its filenames
  while refusing its contents — the names are a clue, the contents are the prize.

---

## Adding a challenge

Copy this shape into a new section above, and build it per
[ARCHITECTURE.md §7](ARCHITECTURE.md#7-extension-points--how-to-add-anything).

```markdown
## N · Name

**Module:** `server/content/modules/NN-slug.ts` · **Status:** live | draft

**What they're trying to find**
One sentence.

**Where it is**
The exact path or host.

**The process**
How a player gets from what they already know to this. Name the pointer that
sends them here — if you cannot, the challenge is unreachable.

**What they have to do**
The concrete action, and any credential in full.

**Board markers**
- `objective-id` — what it means when it lights up on the projector.
```

### Rules

- **Name the pointer.** Every challenge must be reachable from something a
  player already has. Preflight cannot check this; walk your own content cold
  and prove it.
- **Write the `note` on every objective.** Someone reads the board live and has
  to decide whether the room is stuck.
- **No progress ever reaches the player.** No toasts, no checklists, no
  objective data on the wire. Markers are for the facilitator board alone.
- **Fake hostnames use a TLD that does not exist** — `.hack`, `.corp`,
  `.internal`, `.local`, `.home`, `.test`, `.invalid`, `.example`. Preflight
  enforces this. Note `.xyz` and `.web` are *real*, delegated TLDs despite
  looking invented, so an address on one can resolve to a stranger's website.
- **Update this file in the same commit.** A challenge that only exists in code
  is one the next person will accidentally duplicate.
- **Add checks to `scripts/walk.ts`.** It plays the whole investigation and is
  what catches a broken chain between modules.
