import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flagFor } from "../lib/flags";
import { installerCode, product } from "../lib/lockDatasheet";

const FLAG = flagFor("hands-on-practice/smart-lock");

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #09090F; color: #DDD;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; line-height: 1.55;
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 2rem 1rem;
  }

  .wrap { width: 100%; max-width: 640px; }
  .label { font-size: 0.7rem; letter-spacing: 0.3em; color: #555; text-transform: uppercase; }
  h1 { font-size: 1.3rem; color: #A855F7; margin: 0.4rem 0 0.4rem; }
  .brief { color: #777; margin-bottom: 1.6rem; }
  .brief a { color: #A855F7; }

  .lock {
    width: 260px; margin: 0 auto;
    background: linear-gradient(170deg, #26262E, #15151B);
    border: 1px solid #33333F; border-radius: 18px;
    padding: 1.4rem 1.2rem 1.6rem;
    box-shadow: 0 18px 40px #00000070, inset 0 1px 0 #FFFFFF12;
  }

  .badge {
    text-align: center; font-size: 0.6rem; letter-spacing: 0.22em;
    color: #6A6A7A; text-transform: uppercase; margin-bottom: 0.9rem;
  }

  .screen {
    background: #06110B; border: 1px solid #14301F; border-radius: 6px;
    padding: 0.7rem 0.8rem; margin-bottom: 1.1rem; min-height: 68px;
  }

  .entry {
    font-size: 1.5rem; letter-spacing: 0.35em; color: #35E07E;
    text-shadow: 0 0 10px #35E07E60; min-height: 1.6rem; word-break: break-all;
  }
  .status { font-size: 0.68rem; color: #2A8A55; margin-top: 0.2rem; }
  .status.bad { color: #E0574A; }
  .status.good { color: #35E07E; }

  .pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }

  .pad button {
    background: #2E2E38; border: 1px solid #3C3C4A; border-radius: 8px;
    color: #E4E4EE; font: inherit; font-size: 1rem; padding: 0.7rem 0;
    cursor: pointer; box-shadow: inset 0 1px 0 #FFFFFF12;
  }
  .pad button:hover { background: #3A3A46; }
  .pad button:active { background: #24242C; transform: translateY(1px); }
  .pad .wide { grid-column: span 3; }
  .pad .clear { color: #E0A020; }
  .pad .enter { color: #35E07E; }

  .flag {
    margin-top: 1.4rem; text-align: center;
    color: #00B862; font-weight: 700; font-size: 0.95rem;
  }
`;

function page(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${product.name} — Keypad</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
<div class="wrap">
  <div class="label">Physical access control</div>
  <h1>${product.name}</h1>
  <p class="brief">
    A networked deadbolt, freshly installed and never commissioned. You do not
    have a user code — but you do have
    <a href="/ctf/hands-on-practice/lock-datasheet" target="_blank" rel="noreferrer">the manufacturer's datasheet</a>,
    same as anyone else on the internet.
  </p>

  <div class="lock">
    <div class="badge">AXIOM</div>

    <div class="screen">
      <div class="entry" id="entry"></div>
      <div class="status" id="status">READY</div>
    </div>

    <div class="pad" id="pad"></div>
  </div>

  <div class="flag" id="flag"></div>
</div>

<script>
(function () {
  var entryEl = document.getElementById('entry');
  var statusEl = document.getElementById('status');
  var flagEl = document.getElementById('flag');
  var padEl = document.getElementById('pad');

  var code = '';
  var locked = false;
  var attempts = 0;

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = 'status' + (kind ? ' ' + kind : '');
  }

  function draw() {
    entryEl.textContent = code.replace(/./g, '•');
  }

  function press(digit) {
    if (locked) return;
    if (code.length >= 12) return;
    code += digit;
    draw();
    setStatus('ENTERING');
  }

  function clear() {
    if (locked) return;
    code = '';
    draw();
    setStatus('READY');
  }

  function submit() {
    if (locked || code.length === 0) return;
    setStatus('CHECKING');

    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.unlocked) {
          locked = true;
          entryEl.textContent = 'UNLOCKED';
          setStatus('BOLT RETRACTED — INSTALLER SESSION OPEN', 'good');
          flagEl.textContent = data.flag;
          return;
        }

        attempts += 1;
        code = '';
        draw();
        setStatus('INVALID CODE (' + attempts + ')', 'bad');
      })
      .catch(function () {
        setStatus('CONTROLLER UNREACHABLE', 'bad');
      });
  }

  ['1','2','3','4','5','6','7','8','9'].forEach(function (digit) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = digit;
    button.onclick = function () { press(digit); };
    padEl.appendChild(button);
  });

  var clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'clear';
  clearButton.textContent = '✱';
  clearButton.title = 'Clear';
  clearButton.onclick = clear;
  padEl.appendChild(clearButton);

  var zeroButton = document.createElement('button');
  zeroButton.type = 'button';
  zeroButton.textContent = '0';
  zeroButton.onclick = function () { press('0'); };
  padEl.appendChild(zeroButton);

  var enterButton = document.createElement('button');
  enterButton.type = 'button';
  enterButton.className = 'enter';
  enterButton.textContent = '#';
  enterButton.title = 'Enter';
  enterButton.onclick = submit;
  padEl.appendChild(enterButton);

  document.addEventListener('keydown', function (event) {
    if (event.key >= '0' && event.key <= '9') press(event.key);
    else if (event.key === 'Enter') submit();
    else if (event.key === 'Backspace' || event.key === 'Escape') clear();
  });

  draw();
})();
</script>
</body>
</html>
`;
}

/**
 * The "Smart Lock" challenge. The code is only ever checked here, so the
 * datasheet stays the single place it appears.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { code } = req.body ?? {};

    if (typeof code !== "string") {
      return res.status(400).json({ error: "Missing code" });
    }

    const entered = code.trim();
    return res
      .status(200)
      .json(
        entered === installerCode
          ? { unlocked: true, flag: FLAG }
          : { unlocked: false },
      );
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(page());
}
