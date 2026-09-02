# Mini-CTF

Challenge pages for the CTF we run at general meetings. Live at
`/challenges/mini-ctf` and `/challenges/mini-ctf/<challenge>`.

The slug is fixed on purpose: `/challenges/mini-ctf` is the same link every
meeting, so it can go on a slide deck once and stay correct.

These pages are **unlisted**: nothing on the site links to them, `/challenges`
resolves to the 404 page, and every page sets `noindex, nofollow`. Share the URL
at the meeting. Anyone with the link can open it — this keeps the pages out of
search results, it is not access control.

## Layout

| Path | What it holds |
| --- | --- |
| `src/ctf/types.ts` | `Meeting` / `Challenge` shapes, category labels, `FLAG_FORMAT` |
| `src/ctf/meetings/mini-ctf.ts` | The current meeting's copy: titles, briefs, assets |
| `src/ctf/meetings/index.ts` | Registry and lookups |
| `src/pages/ctf/` | The two generic pages that render any meeting |
| `public/ctf/mini-ctf/` | Downloadable artifacts and hosted challenge pages |
| `api/ctfValidator.ts` | **Flags. Server-side only.** |

## Running the next meeting

It's a content swap — no routes, pages, or types change.

1. Replace the artifacts in `public/ctf/mini-ctf/`. Anything here is publicly
   downloadable at `/ctf/mini-ctf/<filename>`, so don't put solutions there, and
   don't let a filename give the technique away.
2. Rewrite the `challenges` array in `src/ctf/meetings/mini-ctf.ts`.
3. Replace the `mini-ctf` rows in `api/ctfValidator.ts`. The handler itself
   is CTF-agnostic — only that table changes.

**The challenge `slug` appears in two files** — the manifest and the validator's
flag keys — and nothing type-checks that they agree. If they drift, submissions
come back as a 404 from the checker rather than a wrong answer. Change both
together.

Members who solved the previous meeting's challenges start fresh automatically,
because progress is keyed by challenge slug.

### Keeping an old meeting around

Optional. Give it its own slug, add its manifest to the `meetings` array in
`index.ts`, and set `active: false` so its flags stop being accepted. Its
artifacts need their own `public/ctf/<slug>/` folder and its flags need their
own keys in the validator.

## Keep it a menu

`/challenges/mini-ctf` is a list of buttons grouped under plain type headings —
no dates, no points, no scoreboard. A button turns green once its flag is
accepted; that state lives in localStorage under `nusec:ctf:<meeting-slug>`.
Challenge pages are a title, a short brief, the file, and the flag box. No
hints — those are for the room, not the page. The type shows only on the menu.

## Never put a flag in `src/`

Everything under `src/` is compiled into the JavaScript bundle the browser
downloads, so a flag there is readable by anyone who opens devtools. Flags go in
`api/ctfValidator.ts`, which only ever runs on the server and only ever replies
`{ correct: true | false }`.

## Local development

`npm run dev` serves the pages but **not** `/api`, so flag submission will
report that the checker isn't running. Use `vercel dev` to exercise the full
flow.
