/**
 * The operation set behind /tools/cipher — a very small CyberChef.
 *
 * Deliberately parameterless: every operation is a plain string→string
 * function, so a recipe is just a list you apply in order. Ten operations,
 * half of which encode and half of which decode, is enough to teach chaining
 * without turning into a configuration exercise.
 */

export class CipherError extends Error {}

export interface CipherOp {
  id: string;
  name: string;
  group: "encode" | "decode";
  /** One line shown under the name in the palette. */
  hint: string;
  run: (input: string) => string;
}

/* ------------------------------------------------------------------ base64 */

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(text: string): string {
  const cleaned = text.replace(/\s+/g, "");
  if (cleaned.length === 0) return "";

  let binary: string;
  try {
    binary = atob(cleaned);
  } catch {
    throw new CipherError("Not valid Base64 — check for stray characters.");
  }

  return new TextDecoder().decode(
    Uint8Array.from(binary, (character) => character.charCodeAt(0)),
  );
}

/* --------------------------------------------------------------------- hex */

function toHex(text: string): string {
  return [...new TextEncoder().encode(text)]
    .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
    .join("");
}

function fromHex(text: string): string {
  const cleaned = text.replace(/0x/gi, "").replace(/[\s,]+/g, "");
  if (cleaned.length === 0) return "";

  if (!/^[0-9a-f]+$/i.test(cleaned)) {
    throw new CipherError("Not valid hex — only 0-9 and A-F are allowed.");
  }
  if (cleaned.length % 2 !== 0) {
    throw new CipherError("Hex needs an even number of digits.");
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(cleaned.slice(index * 2, index * 2 + 2), 16);
  }

  return new TextDecoder().decode(bytes);
}

/* ------------------------------------------------------------------ others */

function toBinary(text: string): string {
  return [...new TextEncoder().encode(text)]
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join(" ");
}

/** Shifts letters only, so punctuation and digits survive the trip. */
function caesar(text: string, shift: number): string {
  return [...text]
    .map((character) => {
      const code = character.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
      }
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
      }
      return character;
    })
    .join("");
}

/** A↔Z, B↔Y … its own inverse, so one entry covers both directions. */
function atbash(text: string): string {
  return [...text]
    .map((character) => {
      const code = character.charCodeAt(0);
      if (code >= 97 && code <= 122) return String.fromCharCode(219 - code);
      if (code >= 65 && code <= 90) return String.fromCharCode(155 - code);
      return character;
    })
    .join("");
}

/**
 * Listed in a deliberately scrambled order.
 *
 * These used to be declared in the order the challenge's recipe needs, which
 * meant clicking straight down the Decode column solved it without reading
 * anything. Working out the order is the challenge — do not "tidy" this back
 * into sequence. No position here matches its step in the intended recipe.
 */
export const cipherOps: CipherOp[] = [
  {
    id: "reverse",
    name: "Reverse",
    group: "decode",
    hint: "Flips the character order",
    run: (text) => [...text].reverse().join(""),
  },
  {
    id: "atbash",
    name: "Atbash",
    group: "decode",
    hint: "Mirrors the alphabet: A↔Z, B↔Y",
    run: atbash,
  },
  {
    id: "from-base64",
    name: "From Base64",
    group: "decode",
    hint: "Back to the original bytes",
    run: fromBase64,
  },
  {
    id: "caesar-minus",
    name: "Caesar Shift −3",
    group: "decode",
    hint: "Rotates letters back three places",
    run: (text) => caesar(text, -3),
  },
  {
    id: "from-hex",
    name: "From Hex",
    group: "decode",
    hint: "Hex digit pairs back to bytes",
    run: fromHex,
  },
  {
    id: "to-binary",
    name: "To Binary",
    group: "encode",
    hint: "Each byte as eight bits",
    run: toBinary,
  },
  {
    id: "caesar-plus",
    name: "Caesar Shift +3",
    group: "encode",
    hint: "Rotates letters forward three places",
    run: (text) => caesar(text, 3),
  },
  {
    id: "to-base64",
    name: "To Base64",
    group: "encode",
    hint: "Bytes into A–Z a–z 0–9 + /",
    run: toBase64,
  },
  {
    id: "url-encode",
    name: "URL Encode",
    group: "encode",
    hint: "Percent-escapes unsafe characters",
    run: (text) => encodeURIComponent(text),
  },
  {
    id: "to-hex",
    name: "To Hex",
    group: "encode",
    hint: "Each byte as two hex digits",
    run: toHex,
  },
];

export function opById(id: string): CipherOp | undefined {
  return cipherOps.find((op) => op.id === id);
}

export interface RecipeStep {
  /** Output after this step, or the text as it stood if the step failed. */
  output: string;
  error?: string;
}

/** Applies a recipe in order, stopping the chain at the first failure. */
export function runRecipe(input: string, ids: string[]): RecipeStep[] {
  const steps: RecipeStep[] = [];
  let current = input;
  let broken = false;

  for (const id of ids) {
    if (broken) {
      steps.push({ output: "", error: "Skipped — an earlier step failed." });
      continue;
    }

    const op = opById(id);
    if (!op) {
      steps.push({ output: current, error: "Unknown operation." });
      broken = true;
      continue;
    }

    try {
      current = op.run(current);
      steps.push({ output: current });
    } catch (error) {
      steps.push({
        output: "",
        error:
          error instanceof CipherError ? error.message : "That step failed.",
      });
      broken = true;
    }
  }

  return steps;
}
