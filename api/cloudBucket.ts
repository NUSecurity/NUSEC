import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  bucketName,
  bucketRegion,
  continuationToken,
  firstPage,
  objectFor,
  secondPage,
  type BucketObject,
} from "../lib/bucketObjects";

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
    background: #09090F; color: #C9C9D8;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; line-height: 1.6; padding: 2rem 1rem 4rem;
  }

  .wrap { max-width: 900px; margin: 0 auto; }

  .bar {
    display: flex; align-items: center; gap: 0.6rem;
    border: 1px solid #1E1E3A; background: #101019;
    padding: 0.5rem 0.8rem; margin-bottom: 1.2rem;
  }
  .dots { display: flex; gap: 0.3rem; }
  .dots i { width: 9px; height: 9px; border-radius: 50%; background: #2A2A40; display: block; }
  .url {
    flex: 1; background: #06060B; border: 1px solid #1E1E3A;
    padding: 0.25rem 0.6rem; color: #7A7A95; font-size: 0.72rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  pre { white-space: pre-wrap; overflow-wrap: anywhere; }

  .tag { color: #6EA8FE; }
  .val { color: #E8E8F2; }
  .key-link { color: #A855F7; text-decoration: none; }
  .key-link:hover { text-decoration: underline; }
  .truncated { color: #E0A020; }

  .object {
    border: 1px solid #1E1E3A; background: #06060B;
    padding: 0.9rem; margin-top: 1rem;
  }

  .head { color: #555; font-size: 0.72rem; margin-bottom: 0.6rem; }
  a.back { color: #A855F7; }
  .binary { color: #666; }
`;

function shell(url: string, inner: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${escapeHtml(bucketName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
<div class="wrap">
  <div class="bar">
    <div class="dots"><i></i><i></i><i></i></div>
    <div class="url">${escapeHtml(url)}</div>
  </div>
  ${inner}
</div>
</body>
</html>
`;
}

const base = "/ctf/hands-on-practice/bucket";

function entryXml(entry: BucketObject): string {
  const href = `${base}?key=${encodeURIComponent(entry.key)}`;
  return `  <span class="tag">&lt;Contents&gt;</span>
    <span class="tag">&lt;Key&gt;</span><a class="key-link" href="${href}">${escapeHtml(entry.key)}</a><span class="tag">&lt;/Key&gt;</span>
    <span class="tag">&lt;LastModified&gt;</span><span class="val">${entry.modified}</span><span class="tag">&lt;/LastModified&gt;</span>
    <span class="tag">&lt;Size&gt;</span><span class="val">${entry.size}</span><span class="tag">&lt;/Size&gt;</span>
    <span class="tag">&lt;StorageClass&gt;</span><span class="val">${entry.storageClass}</span><span class="tag">&lt;/StorageClass&gt;</span>
  <span class="tag">&lt;/Contents&gt;</span>`;
}

function listing(token: string | undefined): string {
  const onSecondPage = token === continuationToken;
  const entries = onSecondPage ? secondPage : firstPage;

  const truncation = onSecondPage
    ? `  <span class="tag">&lt;IsTruncated&gt;</span><span class="val">false</span><span class="tag">&lt;/IsTruncated&gt;</span>`
    : `  <span class="tag">&lt;IsTruncated&gt;</span><span class="truncated">true</span><span class="tag">&lt;/IsTruncated&gt;</span>
  <span class="tag">&lt;NextContinuationToken&gt;</span><span class="truncated">${continuationToken}</span><span class="tag">&lt;/NextContinuationToken&gt;</span>`;

  const url = onSecondPage
    ? `https://${bucketName}.s3.${bucketRegion}.example/?list-type=2&continuation-token=${continuationToken}`
    : `https://${bucketName}.s3.${bucketRegion}.example/?list-type=2`;

  const body = `<pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
<span class="tag">&lt;ListBucketResult</span> xmlns="http://s3.example/doc/2006-03-01/"<span class="tag">&gt;</span>
  <span class="tag">&lt;Name&gt;</span><span class="val">${bucketName}</span><span class="tag">&lt;/Name&gt;</span>
  <span class="tag">&lt;Prefix/&gt;</span>
  <span class="tag">&lt;KeyCount&gt;</span><span class="val">${entries.length}</span><span class="tag">&lt;/KeyCount&gt;</span>
  <span class="tag">&lt;MaxKeys&gt;</span><span class="val">${firstPage.length}</span><span class="tag">&lt;/MaxKeys&gt;</span>
${truncation}
${entries.map(entryXml).join("\n")}
<span class="tag">&lt;/ListBucketResult&gt;</span></pre>`;

  return shell(url, body);
}

function objectPage(key: string): string {
  const entry = objectFor(key);
  const url = `https://${bucketName}.s3.${bucketRegion}.example/${key}`;

  if (!entry) {
    return shell(
      url,
      `<pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
<span class="tag">&lt;Error&gt;</span>
  <span class="tag">&lt;Code&gt;</span><span class="val">NoSuchKey</span><span class="tag">&lt;/Code&gt;</span>
  <span class="tag">&lt;Key&gt;</span><span class="val">${escapeHtml(key)}</span><span class="tag">&lt;/Key&gt;</span>
<span class="tag">&lt;/Error&gt;</span></pre>
<p style="margin-top:1rem"><a class="back" href="${base}">&larr; back to the listing</a></p>`,
    );
  }

  const contents = entry.body
    ? `<pre>${escapeHtml(entry.body)}</pre>`
    : `<p class="binary">Binary object — ${entry.size} bytes. No text representation.</p>`;

  return shell(
    url,
    `<div class="head">${escapeHtml(entry.key)} · ${entry.size} bytes · ${entry.modified}</div>
<div class="object">${contents}</div>
<p style="margin-top:1rem"><a class="back" href="${base}">&larr; back to the listing</a></p>`,
  );
}

/**
 * The "Open Bucket" challenge: a static-site bucket left world-readable, with
 * backups the migration dropped in by mistake. Nothing is gated — the listing
 * is simply truncated, exactly as a real one is, and page two is only reachable
 * by following the continuation token.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const single = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const key = single(req.query["key"]);
  const token = single(req.query["continuation-token"]);

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  return res.status(200).send(key ? objectPage(key) : listing(token));
}
