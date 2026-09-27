# NUSEC

Two separate applications live in this repository.

- **`/` (branch `main`)** — the club website. Static Vite SPA plus stateless
  serverless functions.
- **`tellez/` (branch `tellez-incident`)** — The Tellez Incident, a live
  forensics exercise with its own stack, its own Vercel project and its own
  database. It never merges to `main`.

**If you are working in `tellez/`, read [`tellez/CLAUDE.md`](tellez/CLAUDE.md)
first.** It has its own conventions, its own checks, and a documentation file
the build will fail without.
