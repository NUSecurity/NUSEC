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
 *
 * Objectives are checked against the facilitator board rather than the
 * responses, because responses no longer mention them: a participant is never
 * told what they have found, and that has to hold in the network tab. The
 * board is the only place progress is visible, so it is the only place worth
 * asserting on.
 */

const BASE = process.env.WALK_BASE ?? "http://localhost:4311";
const KEY = process.env.WALK_KEY ?? "dev";

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

const enc = encodeURIComponent;

async function walk() {
  console.log(`walking ${BASE}\n`);

  const health = await call("/api/health");
  check("health responds", health.status === 200, `got ${health.status}`);
  if (health.status !== 200) return;

  const name = `walker-${Date.now() % 10000}`;
  await call("/api/session", { method: "POST", body: JSON.stringify({ displayName: name }) });
  check("joined", cookie.length > 0);

  const locked = await call("/api/fs/list?path=C%3A");
  check("filesystem refused before the lock screen", locked.status === 403, `got ${locked.status}`);

  const badUser = await call("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: "nobody", password: "nope" }),
  });
  check("wrong username rejected", badUser.body.ok === false);
  check("wrong username hints at the naming style",
    badUser.body.hint === "First initial + last name, e.g. jsmith for John Smith",
    `got "${badUser.body.hint}"`);

  const badPass = await call("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: "atellez", password: "nope" }),
  });
  check("wrong password rejected", badPass.body.ok === false);
  check("right username hints at the password", badPass.body.hint === "Discord username",
    `got "${badPass.body.hint}"`);

  const login = await call("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: " ATellez ", password: "UltimateGuitar" }),
  });
  check("logged in (case and whitespace tolerant)", login.body.ok === true);
  check("success leaks no hint", login.body.hint === undefined);

  const bin = await call(`/api/fs/list?path=${enc("C:/$Recycle.Bin")}`);
  check("recycle bin lists", bin.status === 200);
  check("recycle bin hides the hidden item", bin.body.entries?.length === 9,
    `${bin.body.entries?.length} entries`);
  check("listing leaks no progress", bin.body.revealed === undefined);

  const withHidden = await call(`/api/fs/list?path=${enc("C:/$Recycle.Bin")}&hidden=1`);
  check("show-hidden reveals the extra item", withHidden.body.entries?.length === 10);

  const note = await call(`/api/fs/read?path=${enc("C:/$Recycle.Bin/notes-to-self.txt")}`);
  check("portal note readable", note.status === 200);
  check("reading a file leaks no progress", note.body.revealed === undefined);

  const body = String(note.body.content?.body ?? "");
  // Anchored to a whole line: an unanchored base64 pattern happily matches a
  // chunk of "ledger.brightlinepay.hack" first.
  const encoded = body.match(/^\s*([A-Za-z0-9+/]{12,}={0,2})\s*$/m)?.[1] ?? "";
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  check("note carries a decodable username", decoded === "atellez.admin", `decoded "${decoded}"`);
  check("note points at the portal", body.includes("ledger.brightlinepay.hack"));

  const sealed = await call("/api/web/fetch?host=ledger.brightlinepay.hack&path=/payouts");
  check("payouts sealed before the credential", sealed.status === 403, `got ${sealed.status}`);

  const sealedClassified = await call("/api/web/fetch?host=ledger.brightlinepay.hack&path=/classified");
  check("classified sealed before the credential", sealedClassified.status === 403, `got ${sealedClassified.status}`);

  const sealedSteps = await call("/api/web/challenge", {
    method: "POST",
    body: JSON.stringify({ challenge: "classified", answer: "dadgad-capo2" }),
  });
  check("classified steps refused before the portal login", sealedSteps.status === 404, `got ${sealedSteps.status}`);

  const notes = await call(`/api/fs/list?path=${enc("C:/Users/atellez/Desktop/notes")}`);
  check("notes folder lists", notes.body.entries?.length === 14, `${notes.body.entries?.length} files`);

  const tuning = await call(`/api/fs/read?path=${enc("C:/Users/atellez/Desktop/notes/tuning-notes.txt")}`);
  check("password note readable", tuning.status === 200);

  const password = String(tuning.body.content?.body ?? "").match(/pw is ([\w-]+)/)?.[1] ?? "";
  check("password note contains the password", password.length > 0, "no password matched");

  const auth = await call("/api/web/auth", {
    method: "POST",
    body: JSON.stringify({ host: "ledger.brightlinepay.hack", username: decoded, password }),
  });
  check("portal accepts the found credentials", auth.body.ok === true);

  // The regression that matters most: a credential passed in one request has
  // to survive into the next, because progress is derived from the event log.
  const payouts = await call("/api/web/fetch?host=ledger.brightlinepay.hack&path=/payouts");
  check("payouts open on a LATER request", payouts.status === 200, `got ${payouts.status}`);
  check("ledger totals intact", payouts.body.data?.totals?.in === 2400000);
  check("the page leaks no progress", payouts.body.revealed === undefined);

  // Classified: three factors, in order, behind the portal login.
  const CLASSIFIED = "/api/web/fetch?host=ledger.brightlinepay.hack&path=/classified";
  const answer = (body: Record<string, unknown>) =>
    call("/api/web/challenge", { method: "POST", body: JSON.stringify({ challenge: "classified", ...body }) });
  const pushes = async () =>
    (await call("/api/web/challenge?app=authenticator")).body.requests ?? [];

  const gate = await call(CLASSIFIED);
  check("classified serves step one", gate.body.challenge?.kind === "secret", JSON.stringify(gate.body.challenge));
  check("classified sends no data while gated", gate.body.data === null);
  check("step one does not leak the questions", gate.body.challenge?.questions === undefined);

  const gatedLog = await call(`${CLASSIFIED}/messages`);
  check("message log is behind the same gate", gatedLog.body.challenge?.kind === "secret" && gatedLog.body.data === null);
  check("authenticator is empty before the password", (await pushes()).length === 0);

  const early = await answer({ decision: "approve" });
  check("approving before the password does nothing", early.body.ok === false);

  const wrongPw = await answer({ answer: "hellohackers" });
  check("wrong classified password rejected", wrongPw.body.ok === false);

  check("right classified password accepted", (await answer({ answer: password })).body.ok === true);
  check("page now waits on the authenticator", (await call(CLASSIFIED)).body.challenge?.kind === "approval");
  check("authenticator received the push", (await pushes()).length === 1);

  check("page cannot approve itself", (await answer({})).body.ok === false);

  await answer({ decision: "deny" });
  const denied = await call(CLASSIFIED);
  check("deny sends the gate back to the password", denied.body.challenge?.step === 1);
  check("deny is explained on the page", denied.body.challenge?.notice === "denied");
  check("deny clears the push", (await pushes()).length === 0);

  await answer({ answer: password });
  check("approve accepted", (await answer({ decision: "approve" })).body.ok === true);

  const questions = await call(CLASSIFIED);
  check("page now asks three questions", questions.body.challenge?.questions?.length === 3);
  check("questions step still sends no data", questions.body.data === null);

  // The answers come from the machine, the way a player would get them.
  const gym = await call(`/api/fs/read?path=${enc("C:/Users/atellez/Desktop/notes/gym.txt")}`);
  const legs = String(gym.body.content?.body ?? "").match(/^(\w+)\s+legs$/m)?.[1] ?? "";
  check("gym.txt names the leg day", legs === "thu", `got "${legs}"`);

  const books = await call(`/api/fs/read?path=${enc("C:/Users/atellez/Desktop/notes/book-recs.txt")}`);
  const book = String(books.body.content?.body ?? "").match(/^- (.+) \(reread, still my favorite\)$/m)?.[1] ?? "";
  check("book-recs.txt names the favorite", book.length > 0, "no favorite marked");

  // The treasurer's name is split across the thread: first name in Alec's
  // greeting, surname in the treasurer's own address.
  const thread = await call(`/api/fs/read?path=${enc("C:/Users/atellez/Documents/money stuff/treasurer-thread.eml")}`);
  const mails = JSON.stringify(thread.body.content ?? {});
  const first = mails.match(/Hey (\w+),/)?.[1] ?? "";
  const sender = String(thread.body.content?.messages?.[0]?.from ?? "");
  const surname = sender.match(/^\w\.(\w+)@/)?.[1] ?? "";
  const treasurer = `${first} ${surname}`;
  check("treasurer thread yields the full name", treasurer.toLowerCase() === "arjun uppal", `got "${treasurer}"`);

  const wrongQs = await answer({ answers: [legs, book, first] });
  check("first name alone is not enough", wrongQs.body.ok === false);
  check("a wrong answer does not say which", wrongQs.body.message === "One or more answers were incorrect.");

  const rightQs = await answer({ answers: [` ${legs.toUpperCase()} `, book.toUpperCase(), treasurer.toLowerCase()] });
  check("security questions accepted (case and whitespace tolerant)", rightQs.body.ok === true);

  const vault = await call(CLASSIFIED);
  check("classified opens on a LATER request", vault.body.challenge === undefined && Array.isArray(vault.body.data?.rows));
  check("transfers follow the money to Jessica",
    vault.body.data?.total === 2400000 && JSON.stringify(vault.body.data).includes("Jessica James Okafor"));

  const docs = await call(`${CLASSIFIED}/documents`);
  check("scheme documents open", (docs.body.data?.documents?.length ?? 0) > 0);

  const log = await call(`${CLASSIFIED}/messages`);
  const lines: { from: string; body: string }[] = log.body.data?.messages ?? [];
  check("message log opens", lines.length > 0);
  check("message log points at her Instagram",
    lines.some((line) => line.from === "Jessica" && /instagram/i.test(line.body)));

  // Classified relocks: moving between its own pages keeps it open, but
  // loading anything else closes it, and coming back costs all three factors.
  check("its own pages keep it open", (await call(CLASSIFIED)).body.challenge === undefined);
  await call("/api/web/fetch?host=ledger.brightlinepay.hack&path=/payouts");
  const relocked = await call(`${CLASSIFIED}/messages`);
  check("leaving classified locks it again", relocked.body.challenge?.step === 1 && relocked.body.data === null);
  check("a relock is not reported as a denial", relocked.body.challenge?.notice === undefined);

  await answer({ answer: password });
  await answer({ decision: "approve" });
  await answer({ answers: [legs, book, "Arjun Uppal"] });
  check("the three factors open it again", (await call(CLASSIFIED)).body.challenge === undefined);

  // Everything above proved the player's view. The board is where progress is
  // supposed to be visible, so prove it landed there too.
  const board = await call(`/api/board?key=${enc(KEY)}`);
  if (board.status !== 200) {
    check("board readable", false, `got ${board.status} — set WALK_KEY to FACILITATOR_PASSWORD`);
  } else {
    const me = (board.body.sessions ?? []).find(
      (s: { displayName: string }) => s.displayName === name,
    );
    const reached: string[] = me?.objectives ?? [];

    for (const id of [
      "desktop-unlocked", "recycle-bin-opened", "portal-link-found",
      "notes-folder-opened", "password-note-opened", "portal-breached",
      "payout-ledger-seen", "case-assembled",
      "classified-password", "classified-approved", "classified-unlocked",
      "jessica-transfers-seen", "scheme-documents-read", "message-log-read",
    ]) {
      check(`board recorded ${id}`, reached.includes(id));
    }
  }

  // Start over: a refresh keeps the session, so signing out has to really end it.
  const signOut = await call("/api/session", { method: "DELETE" });
  check("sign out succeeds", signOut.status === 200, `got ${signOut.status}`);
  check("signed out means no session", (await call("/api/session")).status === 401);
  check("signed out sees no files", (await call(`/api/fs/list?path=${enc("C:")}`)).status === 401);

  console.log(`\n${failures === 0 ? "walk: ok" : `walk: ${failures} failure(s)`}`);
  process.exit(failures === 0 ? 0 : 1);
}

walk().catch((error) => {
  console.error("walk: could not reach the server —", error.message);
  console.error("is `npm run dev` running?");
  process.exit(1);
});
