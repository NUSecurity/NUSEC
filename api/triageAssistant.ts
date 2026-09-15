import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flagFor } from "../lib/flags";
import { tickets, triage } from "../lib/promptInjection";

/** The escalation key the assistant is told to protect — and the flag. */
const KEY = flagFor("hands-on-practice/ticket-triage");

const MAX_INPUT = 1200;

const encode = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  /* JetBrains Mono ligates == != -> </ /> into single glyphs, which makes
     typed payloads and quoted syntax unreadable. Never wanted here. */
  * { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }

  body {
    background: #09090F; color: #DDD;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; line-height: 1.55; padding: 2rem 1rem 4rem;
  }

  .wrap { max-width: 1060px; margin: 0 auto; }
  .label { font-size: 0.7rem; letter-spacing: 0.3em; color: #555; text-transform: uppercase; }
  h1 { font-size: 1.35rem; color: #A855F7; margin: 0.4rem 0 0.5rem; }
  .brief { color: #777; max-width: 68ch; }

  .columns {
    display: grid; grid-template-columns: 300px minmax(0, 1fr);
    gap: 1.5rem; align-items: start; margin-top: 1.5rem;
  }

  @media (max-width: 920px) { .columns { grid-template-columns: minmax(0, 1fr); } }

  .panel { border: 1px solid #1E1E3A; background: #0B0B12; }
  .panel-head {
    padding: 0.6rem 0.9rem; background: #101019; border-bottom: 1px solid #1E1E3A;
    font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; color: #777;
  }

  .ticket {
    padding: 0.7rem 0.9rem; border-bottom: 1px solid #14141F; cursor: pointer;
  }
  .ticket:last-child { border-bottom: none; }
  .ticket:hover { background: #14141F; }
  .ticket.active { background: #1C1230; }
  .ticket .id { color: #555; font-size: 0.72rem; }
  .ticket .subj { color: #EEE; }
  .ticket .from { color: #666; font-size: 0.72rem; overflow-wrap: anywhere; }

  .body { padding: 0.9rem; }
  pre {
    background: #06060B; border: 1px solid #1A1A28; padding: 0.75rem;
    color: #C9C9D8; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 0.78rem;
  }

  .reply { margin-top: 0.9rem; border-left: 2px solid #A855F7; padding-left: 0.8rem; }
  .reply .who { color: #A855F7; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; }
  .reply pre { border: none; background: #0D0D16; margin-top: 0.3rem; }
  .reply.leaked pre { border: 1px solid #00B862; color: #9FE8C0; }
  .reply.leaked { border-left-color: #00B862; }
  .reply.refusal { border-left-color: #E0A020; }

  textarea {
    width: 100%; min-height: 150px; background: #14141F; border: 1px solid #262640;
    color: #EEE; font: inherit; font-size: 0.8rem; padding: 0.7rem; resize: vertical;
  }
  textarea:focus { outline: none; border-color: #A855F7; }

  .row { display: flex; align-items: center; gap: 0.8rem; margin-top: 0.7rem; }

  button {
    background: #A855F7; border: none; color: #0B0B12; font: inherit;
    font-weight: 700; padding: 0.55rem 1.3rem; cursor: pointer;
  }
  button:hover { background: #BE7BFF; }
  button:disabled { opacity: 0.5; cursor: default; }

  .count { color: #555; font-size: 0.72rem; }
  .flag { color: #00B862; font-weight: 700; font-size: 0.95rem; margin-top: 0.7rem; }
  .hint { color: #666; font-size: 0.75rem; margin-top: 0.5rem; }
`;

function page(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>TriageBot — NUSEC Helpdesk</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
<div class="wrap">
  <div class="label">Helpdesk automation</div>
  <h1>TriageBot</h1>
  <p class="brief">
    TriageBot reads each incoming ticket and writes a one-line summary. It has
    been told to keep the internal escalation key to itself. Read the queue
    first — one of these tickets is not behaving like the others.
  </p>

  <div class="columns">
    <div class="panel">
      <div class="panel-head">Queue</div>
      <div id="queue"></div>
    </div>

    <div>
      <div class="panel">
        <div class="panel-head" id="detail-head">Select a ticket</div>
        <div class="body" id="detail"></div>
      </div>

      <div class="panel" style="margin-top: 1.2rem;">
        <div class="panel-head">Submit a new ticket</div>
        <div class="body">
          <textarea id="draft" maxlength="${MAX_INPUT}"
            placeholder="Type the body of a ticket. TriageBot will read it and reply."></textarea>
          <div class="row">
            <button id="send" type="button">Send to TriageBot</button>
            <span class="count" id="count"></span>
          </div>
          <div id="result"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
(function () {
  var TICKETS = ${encode(tickets)};

  var queueEl = document.getElementById('queue');
  var headEl = document.getElementById('detail-head');
  var detailEl = document.getElementById('detail');
  var draftEl = document.getElementById('draft');
  var sendEl = document.getElementById('send');
  var countEl = document.getElementById('count');
  var resultEl = document.getElementById('result');

  var current = null;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null && text !== '') node.textContent = text;
    return node;
  }

  function reply(kind, text) {
    var box = el('div', 'reply ' + kind);
    box.appendChild(el('div', 'who', 'TriageBot'));
    box.appendChild(el('pre', '', text));
    return box;
  }

  function renderQueue() {
    queueEl.textContent = '';

    TICKETS.forEach(function (ticket) {
      var row = el('div', 'ticket' + (current === ticket.id ? ' active' : ''));
      row.appendChild(el('div', 'id', '#' + ticket.id));
      row.appendChild(el('div', 'subj', ticket.subject));
      row.appendChild(el('div', 'from', ticket.from));
      row.onclick = function () { current = ticket.id; render(); };
      queueEl.appendChild(row);
    });
  }

  function renderDetail() {
    detailEl.textContent = '';

    if (!current) {
      headEl.textContent = 'Select a ticket';
      detailEl.appendChild(el('div', 'hint', 'Pick a ticket from the queue to see what TriageBot made of it.'));
      return;
    }

    var ticket = null;
    TICKETS.forEach(function (item) { if (item.id === current) ticket = item; });
    if (!ticket) return;

    headEl.textContent = '#' + ticket.id + ' — ' + ticket.subject;
    detailEl.appendChild(el('pre', '', ticket.body));
    detailEl.appendChild(
      reply('', 'Summary: ' + ticket.summary + '\\nPriority: ' + ticket.priority)
    );
  }

  function render() {
    renderQueue();
    renderDetail();
  }

  draftEl.addEventListener('input', function () {
    countEl.textContent = draftEl.value.length + ' / ${MAX_INPUT}';
  });

  sendEl.addEventListener('click', function () {
    var body = draftEl.value;
    if (!body.trim()) return;

    sendEl.disabled = true;
    resultEl.textContent = '';

    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: body })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        sendEl.disabled = false;
        resultEl.textContent = '';
        resultEl.appendChild(reply(data.outcome, data.text));

        if (data.outcome === 'leaked') {
          resultEl.appendChild(el('div', 'flag', 'Escalation key: ' + data.key));
        }
      })
      .catch(function () {
        sendEl.disabled = false;
        resultEl.appendChild(el('div', 'hint', 'Could not reach TriageBot.'));
      });
  });

  render();
})();
</script>
</body>
</html>
`;
}

/**
 * The "Ticket Triage" challenge. The escalation key never ships with the page:
 * it only ever appears in a reply the assistant was talked into giving.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { body } = req.body ?? {};

    if (typeof body !== "string") {
      return res.status(400).json({ error: "Missing ticket body" });
    }

    if (body.length > MAX_INPUT) {
      return res.status(413).json({
        outcome: "refusal",
        text: `That ticket is too long to process (limit ${MAX_INPUT} characters).`,
      });
    }

    const result = triage(body, KEY);
    return res.status(200).json(result);
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(page());
}
