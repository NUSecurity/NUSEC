import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flagFor } from "../lib/flags.js";
import { installerCode, product } from "../lib/lockDatasheet.js";

const FLAG = flagFor("hands-on-practice/smart-lock");

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  * { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }

  body {
    background: radial-gradient(ellipse at 50% 35%, #15151B 0%, #09090F 62%);
    color: #DDD;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; line-height: 1.55;
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 2.5rem 1rem;
  }

  .wrap { width: 100%; max-width: 560px; text-align: center; }
  .label { font-size: 0.7rem; letter-spacing: 0.3em; color: #555; text-transform: uppercase; }
  h1 { font-size: 1.3rem; color: #A855F7; margin: 0.4rem 0 0.5rem; }
  .brief { color: #777; margin: 0 auto 2.4rem; max-width: 46ch; }
  .brief a { color: #A855F7; }

  /* ---------------------------------------------------------- the deadbolt */

  .lock {
    position: relative;
    width: 228px;
    margin: 0 auto;
    padding: 1.5rem 1.35rem 1.4rem;
    /* Tall capsule, the way an escutcheon actually reads. */
    border-radius: 114px / 92px;
    background: linear-gradient(180deg,
      #3E3E49 0%, #262630 13%, #1B1B23 50%, #23232D 87%, #131318 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.16),
      inset 0 -1px 0 rgba(0, 0, 0, 0.7),
      inset 0 0 0 1px rgba(0, 0, 0, 0.5),
      0 30px 60px rgba(0, 0, 0, 0.75),
      0 4px 10px rgba(0, 0, 0, 0.6);
  }

  /* Brushed-metal grain. */
  .lock::before {
    content: '';
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
    background: repeating-linear-gradient(90deg,
      rgba(255, 255, 255, 0.022) 0 1px, rgba(255, 255, 255, 0) 1px 3px);
  }

  .screw {
    width: 8px; height: 8px; border-radius: 50%; margin: 0 auto; position: relative;
    background: radial-gradient(circle at 34% 28%, #52525E, #14141A 78%);
    box-shadow: inset 0 -1px 1px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.08);
  }
  .screw::after {
    content: ''; position: absolute; left: 1.5px; right: 1.5px; top: 50%;
    height: 1px; margin-top: -0.5px; background: rgba(0, 0, 0, 0.75);
  }
  .screw.bottom { margin-top: 1.1rem; }

  .brand {
    text-align: center; font-size: 0.58rem; letter-spacing: 0.42em;
    color: #6E6E7C; text-indent: 0.42em;
    margin: 0.8rem 0 1rem;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8);
  }

  .readout {
    display: flex; align-items: center; gap: 0.6rem;
    background: #050E09; border-radius: 5px;
    padding: 0.5rem 0.6rem; margin-bottom: 1.2rem;
    box-shadow: inset 0 2px 7px rgba(0,0,0,0.95), 0 1px 0 rgba(255,255,255,0.07);
  }

  .led {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: #5E5220; box-shadow: 0 0 7px rgba(200, 160, 40, 0.75);
    transition: background 0.2s, box-shadow 0.2s;
  }
  .led.good { background: #35E07E; box-shadow: 0 0 11px rgba(53, 224, 126, 0.95); }
  .led.bad  { background: #E0574A; box-shadow: 0 0 11px rgba(224, 87, 74, 0.95); }

  .lines { flex: 1; min-width: 0; text-align: left; }
  .entry {
    font-size: 1.1rem; letter-spacing: 0.3em; color: #35E07E; min-height: 1.35rem;
    text-shadow: 0 0 9px rgba(53, 224, 126, 0.45); word-break: break-all;
  }
  .status { font-size: 0.6rem; letter-spacing: 0.1em; color: #2C8A57; }
  .status.bad  { color: #E0574A; }
  .status.good { color: #35E07E; }

  .pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }

  .pad button {
    aspect-ratio: 1; border-radius: 50%; cursor: pointer;
    border: 1px solid #0E0E13;
    background: radial-gradient(circle at 34% 26%, #4A4A57, #24242D 68%, #191920 100%);
    color: #E6E6F0; font: inherit; font-size: 1rem;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -2px 3px rgba(0, 0, 0, 0.55),
      0 2px 4px rgba(0, 0, 0, 0.6);
    transition: transform 0.06s, box-shadow 0.06s;
  }

  .pad button:hover { background: radial-gradient(circle at 34% 26%, #55555F, #2A2A34 68%, #1D1D24 100%); }
  .pad button:active {
    transform: translateY(1.5px);
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.8);
  }
  .pad .clear { color: #E0A020; }
  .pad .enter { color: #35E07E; }

  /* The bolt itself: thrown to the right, retracted on a correct code. */
  .boltwell {
    margin-top: 1.3rem; height: 13px; border-radius: 7px; overflow: hidden;
    background: #0C0C11;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.95), 0 1px 0 rgba(255,255,255,0.06);
  }
  .boltbar {
    display: block; height: 100%; width: 58%; margin-left: 42%; border-radius: 7px;
    background: linear-gradient(180deg, #737382, #3C3C48);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.22);
    transition: margin-left 0.55s cubic-bezier(0.4, 1.35, 0.5, 1), background 0.35s;
  }
  body.open .boltbar {
    margin-left: 1%;
    background: linear-gradient(180deg, #47E88C, #148B4C);
  }

  .boltlabel {
    font-size: 0.55rem; letter-spacing: 0.22em; color: #5A5A68;
    margin-top: 0.5rem; text-transform: uppercase;
  }
  body.open .boltlabel { color: #35E07E; }

  .flag { margin-top: 1.6rem; color: #00B862; font-weight: 700; font-size: 0.95rem; }
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
    <div class="screw"></div>
    <div class="brand">AXIOM</div>

    <div class="readout">
      <span class="led" id="led"></span>
      <div class="lines">
        <div class="entry" id="entry"></div>
        <div class="status" id="status">READY</div>
      </div>
    </div>

    <div class="pad" id="pad"></div>

    <div class="boltwell"><span class="boltbar"></span></div>
    <div class="boltlabel" id="boltlabel">Bolt thrown</div>

    <div class="screw bottom"></div>
  </div>

  <div class="flag" id="flag"></div>
</div>

<script>
(function () {
  var entryEl = document.getElementById('entry');
  var ledEl = document.getElementById('led');
  var boltLabelEl = document.getElementById('boltlabel');
  var statusEl = document.getElementById('status');
  var flagEl = document.getElementById('flag');
  var padEl = document.getElementById('pad');

  var code = '';
  var locked = false;
  var attempts = 0;

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = 'status' + (kind ? ' ' + kind : '');
    ledEl.className = 'led' + (kind ? ' ' + kind : '');
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
          entryEl.textContent = 'OPEN';
          setStatus('INSTALLER SESSION OPEN', 'good');
          document.body.classList.add('open');
          boltLabelEl.textContent = 'Bolt retracted';
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
