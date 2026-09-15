/**
 * Every accepted flag, keyed by `<meeting>/<challenge>`.
 *
 * Single source of truth: the checker and any page that hands a flag out both
 * read from here, so a flag can never drift between the two. Flags that are
 * also baked into a downloadable asset are marked — those have to be rotated
 * in the asset as well, or the challenge stops matching its own answer.
 */
export const FLAGS = {
  "hands-on-practice/admin-authentication": ["NUSEC{NUS3C_4DM1N_4CC3SS}"],
  // Handed out by api/sqlPortal.ts once the login query is subverted.
  "hands-on-practice/members-only": ["NUSEC{n3v3r_c0nc4t_y0ur_sql}"],
  // Handed out by api/diskImage.ts once the export destination is named.
  "hands-on-practice/disk-image-triage": ["NUSEC{t1m3l1n3_n3v3r_l13s}"],
  // Also embedded in public/ctf/hands-on-practice/nusec-login.pcapng — rotate together.
  "hands-on-practice/leaked-login": ["NUSEC{w1r3sh4rk_m@st3r}"],
  // Handed out by api/osintProfiles.ts once all five answers land together.
  "hands-on-practice/paper-trail": ["NUSEC{y0ur_p0sts_4r3_th3_pr0f1l3}"],
  // The escalation key api/triageAssistant.ts is told to protect.
  "hands-on-practice/ticket-triage": ["NUSEC{d4t4_1s_n0t_1nstruct10ns}"],
  // Also the SESSION_SECRET inside lib/bucketObjects.ts — rotate together.
  "hands-on-practice/open-bucket": ["NUSEC{buck3ts_sh0uld_n0t_b3_publ1c}"],
  // Handed out by api/smartLock.ts for the datasheet's factory installer code.
  "hands-on-practice/smart-lock": ["NUSEC{d3f4ult_cr3d5_sh1p_w1th_th3_d0cs}"],
  // Encoded in the challenge's `content` in src/ctf/meetings/hands-on-practice.ts.
  // Unwraps as: From Base64, From Hex, Caesar -3, Atbash, Reverse.
  "hands-on-practice/obscure-encryption": ["NUSEC{l4y3r_c4k3}"],
} satisfies Record<string, string[]>;

export type FlagKey = keyof typeof FLAGS;

/** The flag a challenge page hands out once the player has earned it. */
export function flagFor(key: FlagKey): string {
  return FLAGS[key][0];
}

/** Every answer accepted for a challenge, or undefined if there's no such key. */
export function acceptedFlags(key: string): string[] | undefined {
  return (FLAGS as Record<string, string[]>)[key];
}
