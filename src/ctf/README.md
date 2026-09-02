# Mini-CTF

Challenge pages for the CTFs we run at general meetings. Live at
`/challenges/<meeting>` and `/challenges/<meeting>/<challenge>`.

These pages are **unlisted**: nothing on the site links to them, bare
`/challenges` 404s, and every page sets `noindex, nofollow`. Share the URL at
the meeting. Anyone with the link can open it — this keeps the pages out of
search results, it is not access control.

## Layout

| Path | What it holds |
| --- | --- |
| `src/ctf/types.ts` | `Meeting` / `Challenge` shapes |
| `src/ctf/meetings/<meeting>.ts` | One meeting's copy: briefs, hints, assets |
| `src/ctf/meetings/index.ts` | Registry — the list of live meetings |
| `src/pages/ctf/` | The two generic pages that render any meeting |
| `public/ctf/<meeting>/` | Downloadable artifacts and hosted challenge pages |
| `api/ctfValidator.ts` | **Flags. Server-side only.** |

The pages and routes are generic. A new meeting touches only the manifest, the
registry, `public/`, and the validator.

## Adding GM-2

1. `mkdir public/ctf/gm-2` and drop the artifacts in. Anything here is publicly
   downloadable at `/ctf/gm-2/<filename>` — don't put solutions there.
2. `cp src/ctf/meetings/gm-1.ts src/ctf/meetings/gm-2.ts` and rewrite it. Set
   `slug: "gm-2"` and point each asset `href` at `/ctf/gm-2/...`.
3. Add the flags to `api/ctfValidator.ts` under `gm-2/<challenge-slug>` keys.
   Each entry is an array, so list alternate spellings you want to accept.
4. Register it in `src/ctf/meetings/index.ts`, newest first:
   ```ts
   import gm2 from "./gm-2";
   export const meetings: Meeting[] = [gm2, gm1];
   ```

## Retiring GM-1

Either is fine and neither affects GM-2:

- **Archive it** — set `active: false` in `src/ctf/meetings/gm-1.ts`. The page
  still resolves and reads as a write-up, flags stop being scored.
- **Delete it** — remove `src/ctf/meetings/gm-1.ts`, its import and array entry
  in `index.ts`, `public/ctf/gm-1/`, and its block in `api/ctfValidator.ts`.
  `/challenges/gm-1` then 404s.

## Never put a flag in `src/`

Everything under `src/` is compiled into the JavaScript bundle the browser
downloads, so a flag there is readable by anyone who opens devtools. Flags go in
`api/ctfValidator.ts`, which only ever runs on the server and only ever replies
`{ correct: true | false }`.

## Local development

`npm run dev` serves the pages but **not** `/api`, so flag submission will
report that the checker isn't running. Use `vercel dev` to exercise the full
flow, or just check flags against the validator by eye.
