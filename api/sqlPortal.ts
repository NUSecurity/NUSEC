import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flagFor } from "../lib/flags";
import { attemptLogin } from "../lib/sqlInjection";

const FLAG = flagFor("hands-on-practice/members-only");

/** Long enough for any sensible payload, short enough to bound the parser. */
const MAX_INPUT = 300;

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #09090F;
    color: #DDD;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px;
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .card { width: 100%; max-width: 460px; }

  .label {
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: #555;
    text-transform: uppercase;
  }

  h1 { font-size: 1.3rem; color: #A855F7; margin: 0.4rem 0 0.2rem; }
  .build { color: #444; font-size: 0.72rem; margin-bottom: 1.6rem; }

  form { border: 1px solid #1E1E3A; padding: 1.5rem; background: #0C0C14; }

  label { display: block; font-size: 0.68rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: #777; margin-bottom: 0.35rem; }

  input {
    width: 100%;
    background: #14141F;
    border: 1px solid #262640;
    color: #EEE;
    font: inherit;
    padding: 0.6rem 0.75rem;
    margin-bottom: 1.1rem;
  }

  input:focus { outline: none; border-color: #A855F7; }

  button {
    width: 100%;
    background: #A855F7;
    border: none;
    color: #0B0B12;
    font: inherit;
    font-weight: 700;
    padding: 0.65rem;
    cursor: pointer;
  }

  button:hover { background: #BE7BFF; }
  button:disabled { opacity: 0.5; cursor: default; }

  .result { margin-top: 1.2rem; }
  .result .line { font-weight: 700; }

  .denied  .line { color: #C8102E; }
  .member  .line { color: #E0A020; }
  .granted .line { color: #00B862; }
  .error   .line { color: #C8102E; }

  .flag { color: #00B862; font-weight: 700; font-size: 0.95rem; margin-top: 0.5rem; }

  pre {
    margin-top: 0.7rem;
    padding: 0.75rem;
    background: #06060B;
    border: 1px solid #2A1620;
    color: #B08090;
    font-size: 0.72rem;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .trace { color: #6A4050; font-size: 0.68rem; margin-top: 0.4rem; }
  footer { color: #333; font-size: 0.68rem; margin-top: 1.5rem; text-align: center; }
`;

function page(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>NUSEC Member Portal</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
<div class="card">
  <div class="label">NUSEC Internal</div>
  <h1>Member Portal</h1>
  <div class="build">legacy build v1.2 — scheduled for replacement</div>

  <form id="login">
    <label for="username">Username</label>
    <input id="username" name="username" type="text" autocomplete="off"
           spellcheck="false" maxlength="${MAX_INPUT}" required>

    <label for="password">Password</label>
    <input id="password" name="password" type="text" autocomplete="off"
           spellcheck="false" maxlength="${MAX_INPUT}">

    <button type="submit">Sign in</button>
  </form>

  <div class="result" id="result"></div>
  <footer>Trouble signing in? Contact the board.</footer>
</div>

<script>
(function () {
  var form = document.getElementById('login');
  var result = document.getElementById('result');
  var button = form.querySelector('button');

  function show(kind, message, extra) {
    result.className = 'result ' + kind;
    result.textContent = '';

    var line = document.createElement('div');
    line.className = 'line';
    line.textContent = message;
    result.appendChild(line);

    if (extra) result.appendChild(extra);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    button.disabled = true;

    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        button.disabled = false;

        if (data.outcome === 'admin') {
          var flag = document.createElement('div');
          flag.className = 'flag';
          flag.textContent = data.flag;
          show('granted', data.message + ' Welcome, administrator.', flag);
          return;
        }

        if (data.outcome === 'member') {
          show('member', data.message);
          return;
        }

        if (data.outcome === 'error') {
          var box = document.createElement('div');

          var query = document.createElement('pre');
          query.textContent = data.query;
          box.appendChild(query);

          var trace = document.createElement('div');
          trace.className = 'trace';
          trace.textContent = 'at portal/auth.py:41 in authenticate()';
          box.appendChild(trace);

          show('error', data.message, box);
          return;
        }

        show('denied', data.message);
      })
      .catch(function () {
        button.disabled = false;
        show('error', 'The portal is unreachable.');
      });
  });
})();
</script>
</body>
</html>
`;
}

/**
 * The "Members Only" challenge. The login is intentionally injectable; the
 * flag is only ever attached to an admin result, so it never ships to a
 * browser that hasn't got there, same as the other challenge portals.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Missing username or password" });
    }

    if (username.length > MAX_INPUT || password.length > MAX_INPUT) {
      return res.status(413).json({
        outcome: "error",
        message: `OperationalError: input exceeds ${MAX_INPUT} characters`,
        query: "",
      });
    }

    const result = attemptLogin(username, password);
    return res
      .status(200)
      .json(result.outcome === "admin" ? { ...result, flag: FLAG } : result);
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(page());
}
