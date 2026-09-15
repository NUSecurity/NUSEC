import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flagFor } from "../lib/flags.js";

const FLAG = flagFor("hands-on-practice/admin-authentication");

/** Reads one cookie out of the request's Cookie header. */
function readCookie(header: string | undefined, name: string) {
  return header
    ?.split(";")
    .map((pair) => pair.trim().split("="))
    .find(([key]) => key === name)?.[1];
}

function page(granted: boolean) {
  const status = granted ? "ACCESS GRANTED" : "ACCESS DENIED";
  const sub = granted
    ? "Welcome, administrator."
    : "You do not have permission to view this page.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NUSEC Portal</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
  /* JetBrains Mono ligates == != -> </ /> into single glyphs, which makes
     typed payloads and quoted syntax unreadable. Never wanted here. */
  * { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }

    body {
      background: #09090F;
      color: #DDD;
      font-family: 'JetBrains Mono', monospace;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      border: 1px solid #1E1E3A;
      padding: 3rem 2.5rem;
      width: 380px;
      text-align: center;
    }

    .logo {
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      color: #555;
      margin-bottom: 2.5rem;
    }

    .status {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }

    .status.denied  { color: #C8102E; }
    .status.granted { color: #00B862; }

    .sub {
      font-size: 0.7rem;
      color: #444;
    }

    .flag {
      margin-top: 1.5rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #00B862;
    }
  </style>
</head>
<body>

<div class="card">
  <div class="logo">NUSEC INTERNAL PORTAL</div>
  <div class="status ${granted ? "granted" : "denied"}">${status}</div>
  <div class="sub">${sub}</div>
  <div class="flag">${granted ? FLAG : ""}</div>
</div>

</body>
</html>
`;
}

/**
 * The "Admin Authentication" challenge. The admin check runs here rather than
 * in the page so the flag never ships to a browser that hasn't earned it; the
 * cookie stays plain and forgeable on purpose, since tampering with it is the
 * intended solve.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const admin = readCookie(req.headers.cookie, "admin");

  // First visit: hand out a non-admin session cookie.
  if (admin === undefined) {
    res.setHeader("Set-Cookie", "admin=false; Path=/");
  }

  // Never cached: the same URL has to answer differently per cookie.
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  return res.status(200).send(page(admin === "true"));
}
