import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Flag checker for every CTF served under /challenges/*.
 *
 * Nothing below the FLAGS table is CTF-specific — it looks up whatever the
 * client asks for and answers `{ correct }`. Running a new CTF means adding
 * rows to the table, never editing the handler.
 *
 * Flags live ONLY here, on the server. They are never sent to the client and
 * must never be copied into `src/ctf/meetings/*` — that code ships in the
 * browser bundle.
 *
 * Keys are `<meetingSlug>/<challengeSlug>` and must match the slugs in that
 * meeting's manifest exactly; nothing type-checks that they agree, and a
 * mismatch surfaces to solvers as a 404 from the checker rather than a wrong
 * answer. Each entry is a list, so alternate spellings can be accepted.
 *
 * Group rows by meeting under a comment header. Several meetings can sit here
 * at once; delete a meeting's rows once its challenges are retired for good.
 * Note that `active: false` on a manifest only disables the input in the UI —
 * rows left here keep validating, so remove them if that matters.
 */
const FLAGS: Record<string, string[]> = {
  // --- mini-ctf ------------------------------------------------------------
  "mini-ctf/admin-authentication": ["NUSEC{NUS3C_4DM1N_4CC3SS}"],
  "mini-ctf/cool-logo": ["NUSEC{NUS3C_h1dd3n_1n_pla1n_s1ght}"],
  "mini-ctf/leaked-login": ["NUSEC{w1r3sh4lk_m@st3r}"],
};

/** Trim, collapse case, and drop stray whitespace inside the braces. */
function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { meeting, challenge, flag } = req.body ?? {};

  if (
    typeof meeting !== "string" ||
    typeof challenge !== "string" ||
    typeof flag !== "string"
  ) {
    return res.status(400).json({ error: "Missing meeting, challenge, or flag" });
  }

  const accepted = FLAGS[`${meeting}/${challenge}`];

  if (!accepted) {
    return res.status(404).json({ error: "Challenge not found" });
  }

  const submitted = normalize(flag);
  const correct = accepted.some((value) => normalize(value) === submitted);

  // Only ever report the verdict, never the expected flag.
  return res.status(200).json({ correct });
}
