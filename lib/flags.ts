import { secret } from "./env";

/**
 * Every accepted flag, keyed by `<meeting>/<challenge>`.
 *
 * The values live in the environment, not here — this file only maps a
 * challenge to the variable that holds its answer. Single source of truth
 * still applies: the checker and any page that hands a flag out both read
 * through these helpers, so a flag can never drift between the two.
 *
 * A flag that is also baked into a downloadable asset has to be rotated in the
 * asset as well, or the challenge stops matching its own answer:
 *   leaked-login  — embedded in public/ctf/hands-on-practice/nusec-login.pcapng
 *   obscure-encryption — encoded in the challenge `content` in
 *     src/ctf/meetings/hands-on-practice.ts (base64 of hex, then three
 *     letter operations; see the commit that introduced it)
 */
const flagEnv = {
  "hands-on-practice/admin-authentication": "FLAG_ADMIN_AUTHENTICATION",
  "hands-on-practice/members-only": "FLAG_MEMBERS_ONLY",
  "hands-on-practice/disk-image-triage": "FLAG_DISK_IMAGE_TRIAGE",
  "hands-on-practice/leaked-login": "FLAG_LEAKED_LOGIN",
  "hands-on-practice/paper-trail": "FLAG_PAPER_TRAIL",
  "hands-on-practice/ticket-triage": "FLAG_TICKET_TRIAGE",
  "hands-on-practice/open-bucket": "FLAG_OPEN_BUCKET",
  "hands-on-practice/smart-lock": "FLAG_SMART_LOCK",
  "hands-on-practice/obscure-encryption": "FLAG_OBSCURE_ENCRYPTION",
} satisfies Record<string, string>;

export type FlagKey = keyof typeof flagEnv;

/** Every environment variable this site needs configured to work. */
export const requiredFlagVars: string[] = Object.values(flagEnv);

/**
 * Shown in place of a flag when its variable is unset, so a misconfigured
 * deploy is obvious on the page rather than crashing the function.
 */
const NOT_CONFIGURED = "NUSEC{FLAG_NOT_CONFIGURED}";

/** The flag a challenge page hands out once the player has earned it. */
export function flagFor(key: FlagKey): string {
  return secret(flagEnv[key]) ?? NOT_CONFIGURED;
}

/** Every answer accepted for a challenge, or undefined if there's no such key. */
export function acceptedFlags(key: string): string[] | undefined {
  const name = (flagEnv as Record<string, string>)[key];
  if (name === undefined) return undefined;

  const value = secret(name);
  return value === undefined ? undefined : [value];
}
