/**
 * `npm run walk` — plays the whole investigation against a running server.
 *
 * Preflight proves the content is internally consistent. This proves it is
 * still *solvable*: that the gate refuses before the password, that each
 * discovery fires the objective it should, and that a credential passed in one
 * request is still held in the next.
 *
 * Worth running after any change to the engine or to a module that another
 * module depends on. With several people authoring, the chain is the thing
 * that breaks quietly.
 *
 *   npm run dev          # in one terminal
 *   npm run walk         # in another
 */

const BASE = process.env.WALK_BASE ?? "http://localhost:4311";

let cookie = "";
let failures = 0;

async function call(path: string, init?: RequestInit) {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", cookie, ...(init?.headers ?? {}) },
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];

  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : {} };
}

function check(label: string, ok: boolean, detail = "") {
  if (ok) {
    console.log(`  ok    ${label}`);
    return;
  }
  failures += 1;
  console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
}

const revealed = (body: unknown): string[] =>
  ((body as { revealed?: string[] }).revealed ?? []);

const enc = encodeURIComponent;

async function walk() {
  console.log(`walking ${BASE}\n`);

  const health = await call("/api/health");
  check("health responds", health.status === 200, `got ${health.status}`);
  if (health.status !== 200) return;

  await call("/api/session", {
    method: "POST",
    body: JSON.stringify({ displayName: `walker-${Date.now() % 10000}` }),
  });
  check("joined", cookie.length > 0);

  const locked = await call("/api/fs/list?path=C%3A");
  check("filesystem refused before the lock screen", locked.status === 403, `got ${locked.status}`);

  const wrong = await call("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: "ultimateguitar", password: "nope" }),
  });
  check("wrong password rejected", wrong.body.ok === false);

  const login = await call("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: " UltimateGuitar ", password: "HelloHackers" }),
  });
  check("logged in (case and whitespace tolerant)", login.body.ok === true);
  check("unlock fires desktop-unlocked", revealed(login.body).includes("desktop-unlocked"));

  const bin = await call(`/api/fs/list?path=${enc("C:/$Recycle.Bin")}`);
  check("recycle bin lists", bin.status === 200);
  check("recycle bin hides the hidden item", bin.body.entries?.length === 14,
    `${bin.body.entries?.length} entries`);
  check("entering the bin fires its objective", revealed(bin.body).includes("recycle-bin-opened"));

  const withHidden = await call(`/api/fs/list?path=${enc("C:/$Recycle.Bin")}&hidden=1`);
  check("show-hidden reveals the extra item", withHidden.body.entries?.length === 15);

  const note = await call(`/api/fs/read?path=${enc("C:/$Recycle.Bin/notes-to-self.txt")}`);
  check("portal note readable", note.status === 200);
  check("note fires portal-link-found", revealed(note.body).includes("portal-link-found"));

  const body = String(note.body.content?.body ?? "");
  // Anchored to a whole line: an unanchored base64 pattern happily matches a
  // chunk of "ledger.brightlinepay.test" first.
  const encoded = body.match(/^\s*([A-Za-z0-9+/]{12,}={0,2})\s*$/m)?.[1] ?? "";
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  check("note carries a decodable username", decoded === "atellez.admin", `decoded "${decoded}"`);
  check("note points at the portal", body.includes("ledger.brightlinepay.test"));

  const sealed = await call("/api/web/fetch?host=ledger.brightlinepay.test&path=/payouts");
  check("payouts sealed before the credential", sealed.status === 403, `got ${sealed.status}`);

  const notes = await call(`/api/fs/list?path=${enc("C:/Users/atellez/Desktop/notes")}`);
  check("notes folder lists", notes.body.entries?.length === 14, `${notes.body.entries?.length} files`);

  const tuning = await call(`/api/fs/read?path=${enc("C:/Users/atellez/Desktop/notes/tuning-notes.txt")}`);
  check("password note fires its objective", revealed(tuning.body).includes("password-note-opened"));

  const password = String(tuning.body.content?.body ?? "").match(/pw is ([\w-]+)/)?.[1] ?? "";
  check("password note contains the password", password.length > 0, "no password matched");

  const auth = await call("/api/web/auth", {
    method: "POST",
    body: JSON.stringify({ host: "ledger.brightlinepay.test", username: decoded, password }),
  });
  check("portal accepts the found credentials", auth.body.ok === true);

  // The regression that matters most: a credential passed in one request has
  // to survive into the next, because progress is derived from the event log.
  const payouts = await call("/api/web/fetch?host=ledger.brightlinepay.test&path=/payouts");
  check("payouts open on a LATER request", payouts.status === 200, `got ${payouts.status}`);
  check("ledger totals intact", payouts.body.data?.totals?.in === 8420);
  check("reading the ledger completes the case",
    revealed(payouts.body).includes("case-assembled"));

  console.log(`\n${failures === 0 ? "walk: ok" : `walk: ${failures} failure(s)`}`);
  process.exit(failures === 0 ? 0 : 1);
}

walk().catch((error) => {
  console.error("walk: could not reach the server —", error.message);
  console.error("is `npm run dev` running?");
  process.exit(1);
});
