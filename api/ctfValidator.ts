import type { VercelRequest, VercelResponse } from "@vercel/node";

const FLAGS: Record<string, string[]> = {
  // --- mini-ctf ------------------------------------------------------------
  "mini-ctf/admin-authentication": ["NUSEC{NUS3C_4DM1N_4CC3SS}"],
  "mini-ctf/cool-logo": ["NUSEC{NUS3C_h1dd3n_1n_pla1n_s1ght}"],
  "mini-ctf/leaked-login": ["NUSEC{w1r3sh4lk_m@st3r}"],
};

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
    return res
      .status(400)
      .json({ error: "Missing meeting, challenge, or flag" });
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
