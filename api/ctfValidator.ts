import type { VercelRequest, VercelResponse } from "@vercel/node";
import { acceptedFlags } from "../lib/flags.js";

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

  const accepted = acceptedFlags(`${meeting}/${challenge}`);

  if (!accepted) {
    return res.status(404).json({ error: "Challenge not found" });
  }

  const submitted = normalize(flag);
  const correct = accepted.some((value) => normalize(value) === submitted);

  // Only ever report the verdict, never the expected flag.
  return res.status(200).json({ correct });
}
