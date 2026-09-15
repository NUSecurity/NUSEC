/**
 * Every accepted flag, keyed by `<meeting>/<challenge>`.
 *
 * Single source of truth: the checker and any page that hands a flag out both
 * read from here, so a flag can never drift between the two. Flags that are
 * also baked into a downloadable asset are marked — those have to be rotated
 * in the asset as well, or the challenge stops matching its own answer.
 */
export const FLAGS: Record<string, string[]> = {
  "mini-ctf/admin-authentication": ["NUSEC{NUS3C_4DM1N_4CC3SS}"],
  // Also embedded in public/ctf/mini-ctf/logo.png — rotate together.
  "mini-ctf/cool-logo": ["NUSEC{NUS3C_h1dd3n_1n_pla1n_s1ght}"],
  // Also embedded in public/ctf/mini-ctf/nusec-login.pcapng — rotate together.
  "mini-ctf/leaked-login": ["NUSEC{w1r3sh4rk_m@st3r}"],
  // Encoded in the challenge's `content` in src/ctf/meetings/mini-ctf.ts
  // (base64 of hex) — rotate together.
  "mini-ctf/obscure-encryption": ["NUSEC{lay3r_by_l@yer}"],
  // Stored in the nusec.club DNS TXT record.
  "mini-ctf/dns-osint": ["NUSEC{0P3N_S0URC3_D3T3CT1V3}"],
};

export type FlagKey = keyof typeof FLAGS;

/** The flag a challenge page hands out once the player has earned it. */
export function flagFor(key: FlagKey): string {
  return FLAGS[key][0];
}

/** Every answer accepted for a challenge, or undefined if there's no such key. */
export function acceptedFlags(key: string): string[] | undefined {
  return (FLAGS as Record<string, string[]>)[key];
}
