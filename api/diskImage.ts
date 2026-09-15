import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flagFor } from "../lib/flags.js";
import { checkDestination, diskImage, imageLabel } from "../lib/diskImage.js";

const FLAG = flagFor("hands-on-practice/disk-image-triage");

/** Keeps the inlined tree from being able to close the script tag early. */
const treeJson = JSON.stringify(diskImage).replace(/</g, "\\u003c");

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  /* JetBrains Mono ligates == != -> </ /> into single glyphs, which makes
     typed payloads and quoted syntax unreadable. Never wanted here. */
  * { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }

  body {
    background: #09090F;
    color: #DDD;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px;
    line-height: 1.5;
    padding: 2rem 1rem 4rem;
  }

  .wrap { max-width: 980px; margin: 0 auto; }

  h1 { font-size: 1.4rem; color: #A855F7; letter-spacing: 0.04em; }

  .label {
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: #555;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .tip { color: #666; margin-top: 0.6rem; }

  .panel {
    border: 1px solid #1E1E3A;
    margin-top: 1.5rem;
    overflow: hidden;
  }

  .crumbs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    padding: 0.7rem 1rem;
    background: #101019;
    border-bottom: 1px solid #1E1E3A;
  }

  .crumbs button {
    background: none;
    border: none;
    color: #A855F7;
    font: inherit;
    cursor: pointer;
    padding: 0 0.15rem;
  }

  .crumbs button:hover { text-decoration: underline; }
  .crumbs span { color: #444; }

  .scroll { overflow-x: auto; }

  table { width: 100%; min-width: 660px; border-collapse: collapse; }

  th {
    text-align: left;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #777;
    font-weight: 400;
    padding: 0.55rem 1rem;
    background: #0D0D15;
    border-bottom: 1px solid #1E1E3A;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
  }

  th:hover { color: #A855F7; }
  th .arrow { color: #A855F7; }

  td {
    padding: 0.4rem 1rem;
    border-bottom: 1px solid #14141F;
    white-space: nowrap;
  }

  tr.row { cursor: pointer; }
  tr.row:hover td { background: #14141F; }
  tr.row.selected td { background: #1C1230; }

  .dir { color: #6EA8FE; }
  .file { color: #DDD; }
  .hidden-entry { opacity: 0.55; }
  .num { color: #BBB; }
  .time { color: #8A8AA0; }
  .empty { padding: 1rem; color: #666; }

  .detail { border-top: 1px solid #1E1E3A; padding: 1rem; background: #0B0B12; }
  .detail h2 { font-size: 0.95rem; color: #A855F7; margin-bottom: 0.6rem; }

  .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0.5rem 1.5rem; }
  .meta div { min-width: 0; }
  .meta dt { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #666; }
  .meta dd { color: #DDD; overflow-wrap: anywhere; }

  pre {
    margin-top: 1rem;
    padding: 0.8rem;
    background: #06060B;
    border: 1px solid #1A1A28;
    color: #C9C9D8;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .binary { margin-top: 1rem; color: #666; }

  form { margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.6rem; }

  input {
    flex: 1 1 260px;
    background: #14141F;
    border: 1px solid #262640;
    color: #EEE;
    font: inherit;
    padding: 0.6rem 0.8rem;
  }

  input:focus { outline: none; border-color: #A855F7; }

  button.submit {
    background: #A855F7;
    border: none;
    color: #0B0B12;
    font: inherit;
    font-weight: 700;
    padding: 0.6rem 1.4rem;
    cursor: pointer;
  }

  button.submit:hover { background: #BE7BFF; }
  button.submit:disabled { opacity: 0.5; cursor: default; }

  .verdict { margin-top: 0.8rem; }
  .verdict.wrong { color: #C8102E; }
  .verdict.hint { color: #E0A020; }
  .verdict.right { color: #00B862; font-weight: 700; }
  .flag { color: #00B862; font-weight: 700; font-size: 1rem; margin-top: 0.4rem; }
`;

function page(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Disk Image Browser — ${imageLabel}</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
<div class="wrap">
  <div class="label">Mounted read-only</div>
  <h1>${imageLabel}</h1>
  <p class="tip">
    Acquired 2026-09-06 03:05 after an out-of-hours alert. One document was
    copied, renamed, and sent off this machine. Click a heading to sort — the
    timestamps are the whole case.
  </p>

  <div class="panel">
    <div class="crumbs" id="crumbs"></div>
    <div class="scroll">
      <table>
        <thead>
          <tr id="head"></tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
    <div id="empty"></div>
    <div class="detail" id="detail" hidden></div>
  </div>

  <form id="answer">
    <input id="destination" type="text" autocomplete="off" spellcheck="false"
           placeholder="Where was the file exported to?" aria-label="Export destination">
    <button class="submit" type="submit">Submit</button>
  </form>
  <div class="verdict" id="verdict"></div>
</div>

<script>
(function () {
  var TREE = ${treeJson};

  var COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'size', label: 'Size' },
    { key: 'modified', label: 'Modified' },
    { key: 'accessed', label: 'Accessed' },
    { key: 'created', label: 'Created' }
  ];

  var path = [];
  var sortKey = 'name';
  var sortDir = 1;
  var selected = null;

  var crumbsEl = document.getElementById('crumbs');
  var headEl = document.getElementById('head');
  var rowsEl = document.getElementById('rows');
  var emptyEl = document.getElementById('empty');
  var detailEl = document.getElementById('detail');

  function currentDir() {
    var node = TREE;
    for (var i = 0; i < path.length; i++) {
      var next = (node.children || []).filter(function (child) {
        return child.name === path[i] && child.type === 'dir';
      })[0];
      if (!next) return node;
      node = next;
    }
    return node;
  }

  function fullPath(name) {
    return '/' + path.concat(name ? [name] : []).join('/');
  }

  function formatSize(entry) {
    if (entry.type === 'dir') {
      var count = (entry.children || []).length;
      return count + (count === 1 ? ' item' : ' items');
    }
    return Number(entry.size || 0).toLocaleString('en-US') + ' B';
  }

  function sorted(entries) {
    return entries.slice().sort(function (a, b) {
      // Directories stay on top however the rest is sorted, like a file manager.
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;

      var left, right;
      if (sortKey === 'size') {
        left = a.type === 'dir' ? -1 : Number(a.size || 0);
        right = b.type === 'dir' ? -1 : Number(b.size || 0);
      } else {
        left = String(a[sortKey] || '');
        right = String(b[sortKey] || '');
      }

      if (left < right) return -1 * sortDir;
      if (left > right) return 1 * sortDir;
      return 0;
    });
  }

  function renderCrumbs() {
    crumbsEl.textContent = '';

    var root = document.createElement('button');
    root.type = 'button';
    root.textContent = '/';
    root.onclick = function () { navigate([]); };
    crumbsEl.appendChild(root);

    path.forEach(function (segment, index) {
      var sep = document.createElement('span');
      sep.textContent = index === 0 ? '' : '/';
      crumbsEl.appendChild(sep);

      var crumb = document.createElement('button');
      crumb.type = 'button';
      crumb.textContent = segment;
      crumb.onclick = function () { navigate(path.slice(0, index + 1)); };
      crumbsEl.appendChild(crumb);
    });
  }

  function renderHead() {
    headEl.textContent = '';

    COLUMNS.forEach(function (column) {
      var th = document.createElement('th');
      th.textContent = column.label;
      th.setAttribute('scope', 'col');

      if (sortKey === column.key) {
        var arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = sortDir === 1 ? '  ▲' : '  ▼';
        th.appendChild(arrow);
      }

      th.onclick = function () {
        if (sortKey === column.key) sortDir = -sortDir;
        else { sortKey = column.key; sortDir = 1; }
        render();
      };

      headEl.appendChild(th);
    });
  }

  function cell(row, text, className) {
    var td = document.createElement('td');
    td.textContent = text;
    if (className) td.className = className;
    row.appendChild(td);
  }

  function renderRows() {
    rowsEl.textContent = '';
    emptyEl.textContent = '';

    var dir = currentDir();
    var entries = sorted(dir.children || []);

    if (path.length > 0) {
      var up = document.createElement('tr');
      up.className = 'row';
      up.onclick = function () { navigate(path.slice(0, -1)); };
      cell(up, '..', 'dir');
      cell(up, '');
      cell(up, '');
      cell(up, '');
      cell(up, '');
      rowsEl.appendChild(up);
    }

    if (entries.length === 0) {
      emptyEl.className = 'empty';
      emptyEl.textContent = 'This directory is empty.';
      return;
    }

    entries.forEach(function (entry) {
      var row = document.createElement('tr');
      row.className = 'row';
      if (selected && selected.name === entry.name && selected.dir === fullPath()) {
        row.className += ' selected';
      }
      if (entry.name.charAt(0) === '.') row.className += ' hidden-entry';

      row.onclick = function () {
        if (entry.type === 'dir') navigate(path.concat([entry.name]));
        else { selected = { name: entry.name, dir: fullPath(), entry: entry }; render(); }
      };

      cell(row, (entry.type === 'dir' ? '▸ ' : '  ') + entry.name,
           entry.type === 'dir' ? 'dir' : 'file');
      cell(row, formatSize(entry), 'num');
      cell(row, entry.modified, 'time');
      cell(row, entry.accessed, 'time');
      cell(row, entry.created, 'time');
      rowsEl.appendChild(row);
    });
  }

  function metaItem(list, label, value) {
    var wrapper = document.createElement('div');
    var dt = document.createElement('dt');
    dt.textContent = label;
    var dd = document.createElement('dd');
    dd.textContent = value;
    wrapper.appendChild(dt);
    wrapper.appendChild(dd);
    list.appendChild(wrapper);
  }

  function renderDetail() {
    if (!selected || selected.dir !== fullPath()) {
      detailEl.hidden = true;
      detailEl.textContent = '';
      return;
    }

    var entry = selected.entry;
    detailEl.hidden = false;
    detailEl.textContent = '';

    var heading = document.createElement('h2');
    heading.textContent = entry.name;
    detailEl.appendChild(heading);

    var list = document.createElement('dl');
    list.className = 'meta';
    metaItem(list, 'Path', (fullPath() === '/' ? '' : fullPath()) + '/' + entry.name);
    metaItem(list, 'Size', formatSize(entry));
    metaItem(list, 'MD5', entry.md5 || 'n/a');
    metaItem(list, 'Created', entry.created);
    metaItem(list, 'Modified', entry.modified);
    metaItem(list, 'Accessed', entry.accessed);
    detailEl.appendChild(list);

    if (entry.text) {
      var pre = document.createElement('pre');
      pre.textContent = entry.text;
      detailEl.appendChild(pre);
    } else {
      var note = document.createElement('p');
      note.className = 'binary';
      note.textContent = 'Binary contents — no text preview. Metadata only.';
      detailEl.appendChild(note);
    }
  }

  function navigate(next) {
    path = next;
    selected = null;
    render();
  }

  function render() {
    renderCrumbs();
    renderHead();
    renderRows();
    renderDetail();
  }

  var form = document.getElementById('answer');
  var input = document.getElementById('destination');
  var verdict = document.getElementById('verdict');
  var submit = form.querySelector('button');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var answer = input.value.trim();
    if (!answer) return;

    submit.disabled = true;
    verdict.className = 'verdict';
    verdict.textContent = 'Checking…';

    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: answer })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        verdict.textContent = '';

        if (data.correct) {
          verdict.className = 'verdict right';
          verdict.textContent = 'Correct — that is where it went.';
          var flag = document.createElement('div');
          flag.className = 'flag';
          flag.textContent = data.flag;
          verdict.appendChild(flag);
          input.disabled = true;
          return;
        }

        submit.disabled = false;
        verdict.className = data.hint ? 'verdict hint' : 'verdict wrong';
        verdict.textContent = data.hint || 'Not it. Keep working the timeline.';
      })
      .catch(function () {
        submit.disabled = false;
        verdict.className = 'verdict wrong';
        verdict.textContent = 'Could not reach the checker.';
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
 * The "Disk Image Triage" challenge. The tree itself is public — deducing the
 * destination from it is the work — but the answer check runs here so the flag
 * never ships to a browser that hasn't earned it, same as the admin portal.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { answer } = req.body ?? {};

    if (typeof answer !== "string") {
      return res.status(400).json({ error: "Missing answer" });
    }

    const verdict = checkDestination(answer);
    return res
      .status(200)
      .json(verdict.correct ? { correct: true, flag: FLAG } : verdict);
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(page());
}
