/**
 * Session identity.
 *
 * A signed, httpOnly cookie — not a bearer token, and the reason is concrete:
 * gated binaries are fetched by the browser following a plain `<a href>` or
 * `<img src>`, and those requests cannot carry an `Authorization` header. A
 * cookie rides along automatically.
 *
 * The cookie holds `sessionId.hmac`. The client can neither read it nor forge
 * one, and the server needs no session table lookup to reject a tampered id.
 */

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "tellez_sid";

const DEV_SECRET = "tellez-development-key-not-for-production";

function secret(): string {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    // Loud rather than silently insecure: an unsigned-in-practice cookie in
    // production would let anyone mint any session id they liked.
    throw new Error("SESSION_SECRET is unset in production");
  }

  return DEV_SECRET;
}

function sign(id: string): string {
  return createHmac("sha256", secret()).update(id).digest("base64url");
}

export function newSessionId(): string {
  return randomUUID();
}

export function encodeCookie(id: string): string {
  return `${id}.${sign(id)}`;
}

/** Returns the session id only when the signature checks out. */
export function decodeCookie(raw: string | undefined): string | null {
  if (!raw) return null;

  const split = raw.lastIndexOf(".");
  if (split <= 0) return null;

  const id = raw.slice(0, split);
  const provided = Buffer.from(raw.slice(split + 1));
  const expected = Buffer.from(sign(id));

  if (provided.length !== expected.length) return null;
  return timingSafeEqual(provided, expected) ? id : null;
}

/** Pulls one cookie out of a raw `Cookie:` header. */
export function readCookie(header: string | undefined, name = COOKIE_NAME): string | undefined {
  if (!header) return undefined;

  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }

  return undefined;
}

export function cookieHeader(id: string): string {
  const flags = [
    `${COOKIE_NAME}=${encodeCookie(id)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 12}`,
  ];

  // `Secure` would make the cookie unusable over plain http on localhost.
  if (process.env.NODE_ENV === "production") flags.push("Secure");

  return flags.join("; ");
}
