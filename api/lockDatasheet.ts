import type { VercelRequest, VercelResponse } from "@vercel/node";
import { pages, product, type Block } from "../lib/lockDatasheet";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  /* JetBrains Mono ligates == != -> </ /> into single glyphs, which makes
     typed payloads and quoted syntax unreadable. Never wanted here. */
  * { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }

  body {
    background: #14141A; color: #23232B;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12.5px; line-height: 1.65; padding: 2rem 1rem 4rem;
  }

  .sheet {
    max-width: 780px; margin: 0 auto; background: #F4F3EE;
    padding: 2.5rem 3rem 3rem; min-height: 860px;
    box-shadow: 0 0 0 1px #00000040, 0 18px 50px #00000060;
  }

  header { border-bottom: 2px solid #23232B; padding-bottom: 0.8rem; margin-bottom: 1.6rem; }
  .brand { font-size: 1.15rem; font-weight: 700; letter-spacing: 0.02em; }
  .sub { color: #5A5A66; }
  .rev { float: right; color: #7A7A86; font-size: 0.72rem; }

  h2 { font-size: 0.95rem; margin-bottom: 0.9rem; letter-spacing: 0.02em; }
  p { margin-bottom: 0.9rem; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.76rem; }
  th, td { text-align: left; padding: 0.3rem 0.5rem; border: 1px solid #C9C7BC; }
  th { background: #E4E2D8; font-weight: 700; }

  pre {
    background: #23232B; color: #D8D8E0; padding: 0.9rem 1rem;
    font-size: 0.74rem; line-height: 1.6; overflow-x: auto;
    margin-bottom: 1rem; white-space: pre;
  }

  .note {
    border-left: 3px solid #B08900; background: #F6EFD8;
    padding: 0.6rem 0.9rem; margin-bottom: 1rem; font-size: 0.78rem;
  }
  .note b { display: block; font-size: 0.68rem; letter-spacing: 0.14em;
            text-transform: uppercase; color: #8A6D00; margin-bottom: 0.15rem; }

  nav { display: flex; align-items: center; gap: 0.6rem; margin-top: 2rem;
        border-top: 1px solid #C9C7BC; padding-top: 0.9rem; font-size: 0.75rem; }
  nav a { color: #23232B; text-decoration: none; border: 1px solid #C9C7BC;
          padding: 0.25rem 0.7rem; background: #E9E7DD; }
  nav a:hover { background: #DCDACE; }
  nav .spacer { flex: 1; }
  nav .page { color: #7A7A86; }
  nav .disabled { opacity: 0.35; pointer-events: none; }
`;

function renderBlock(block: Block): string {
  switch (block.kind) {
    case "text":
      return `<p>${escapeHtml(block.value)}</p>`;

    case "note":
      return `<div class="note"><b>Note</b>${escapeHtml(block.value)}</div>`;

    case "code":
      return `<pre>${escapeHtml(block.value)}</pre>`;

    case "table":
      return `<table>
  <thead><tr>${block.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
  <tbody>${block.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("")}</tbody>
</table>`;
  }
}

const base = "/ctf/hands-on-practice/lock-datasheet";

function page(index: number): string {
  const current = pages[index];
  const previous = index > 0 ? `${base}?page=${index}` : "";
  const next = index < pages.length - 1 ? `${base}?page=${index + 2}` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${product.name} — Technical Datasheet</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
<div class="sheet">
  <header>
    <span class="rev">${product.revision}</span>
    <div class="brand">${product.name}</div>
    <div class="sub">${product.subtitle} — Technical Datasheet</div>
  </header>

  <h2>${escapeHtml(current.heading)}</h2>
  ${current.blocks.map(renderBlock).join("\n  ")}

  <nav>
    <a class="${previous ? "" : "disabled"}" href="${previous || "#"}">&larr; Previous</a>
    <a class="${next ? "" : "disabled"}" href="${next || "#"}">Next &rarr;</a>
    <span class="spacer"></span>
    <span class="page">Page ${index + 1} of ${pages.length}</span>
  </nav>
</div>
</body>
</html>
`;
}

/** The datasheet for the "Smart Lock" challenge. Six pages, one of them useful. */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const raw = req.query["page"];
  const requested = Number.parseInt(
    Array.isArray(raw) ? (raw[0] ?? "1") : (raw ?? "1"),
    10,
  );
  const index = Number.isFinite(requested)
    ? Math.min(Math.max(requested, 1), pages.length) - 1
    : 0;

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(page(index));
}
