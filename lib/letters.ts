/**
 * The meeting-wide word, handed out one letter at a time by the flag checker.
 *
 * This lives server-side on purpose. Shipping it with the page would let
 * anyone read the whole word out of the bundle without solving anything,
 * which defeats the point of the room having to pool letters.
 *
 * A letter is only ever attached to a response that already carried a correct
 * flag, so possessing one is proof of a solve.
 */
const WORD = "CHAMELEON";

/**
 * Position in the word each challenge is worth. Explicit rather than derived
 * from array order, because the word repeats letters and because the menu in
 * src/ctf/meetings/hands-on-practice.ts can be reordered without meaning to
 * reshuffle these. Keep one entry per challenge.
 */
const positions: Record<string, number> = {
  "hands-on-practice/admin-authentication": 0,
  "hands-on-practice/members-only": 1,
  "hands-on-practice/disk-image-triage": 2,
  "hands-on-practice/leaked-login": 3,
  "hands-on-practice/paper-trail": 4,
  "hands-on-practice/ticket-triage": 5,
  "hands-on-practice/open-bucket": 6,
  "hands-on-practice/smart-lock": 7,
  "hands-on-practice/obscure-encryption": 8,
};

export interface LetterAward {
  letter: string;
  /** 0-based position in the word. */
  index: number;
  total: number;
}

/** The letter a challenge is worth, or undefined if it isn't worth one. */
export function letterFor(key: string): LetterAward | undefined {
  const index = positions[key];
  if (index === undefined || index >= WORD.length) return undefined;
  return { letter: WORD[index], index, total: WORD.length };
}
