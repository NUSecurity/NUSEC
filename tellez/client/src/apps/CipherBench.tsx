import { Icon } from "@/lib/icon";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import type { AppProps, DesktopApp } from "./types";

/**
 * Cipher Bench — a CyberChef-shaped multi-tool.
 *
 * Built in rather than embedding the real thing: an iframe to an outside site
 * would depend on venue wifi reaching it during a live meeting, and would drop
 * a differently-styled web app into the middle of a 2011-era desktop.
 *
 * The model is CyberChef's: an input, a *recipe* of operations applied in
 * order, and an output. Adding an operation is one entry in OPERATIONS below,
 * so a contributor writing an XOR or a Vigenère challenge can give players the
 * tool for it in about ten lines.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesOf = (text: string) => encoder.encode(text);
const textOf = (bytes: Uint8Array) => decoder.decode(bytes);
const hexOf = (bytes: Uint8Array) =>
  [...bytes].map((b) => b.toString(16).padStart(2, "0")).join(" ");

interface Arg {
  key: string;
  label: string;
  type: "text" | "number";
  fallback: string;
}

interface Operation {
  id: string;
  name: string;
  group: string;
  args?: Arg[];
  run(input: string, args: Record<string, string>): string | Promise<string>;
}

function caesar(text: string, shift: number): string {
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch < "a" ? 65 : 97;
    const offset = ch.charCodeAt(0) - base;
    return String.fromCharCode((((offset + shift) % 26) + 26) % 26 + base);
  });
}

async function digest(algorithm: string, text: string): Promise<string> {
  const hash = await crypto.subtle.digest(algorithm, bytesOf(text));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const OPERATIONS: Operation[] = [
  {
    id: "b64-decode", name: "From Base64", group: "Encoding",
    run: (input) => {
      const clean = input.replace(/\s+/g, "");
      if (clean.length === 0) return "";
      const binary = atob(clean);
      return textOf(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
    },
  },
  {
    id: "b64-encode", name: "To Base64", group: "Encoding",
    run: (input) => {
      let binary = "";
      for (const byte of bytesOf(input)) binary += String.fromCharCode(byte);
      return btoa(binary);
    },
  },
  {
    id: "hex-decode", name: "From Hex", group: "Encoding",
    run: (input) => {
      const pairs = input.replace(/[^0-9a-f]/gi, "").match(/../g) ?? [];
      return textOf(Uint8Array.from(pairs, (pair) => parseInt(pair, 16)));
    },
  },
  { id: "hex-encode", name: "To Hex", group: "Encoding", run: (input) => hexOf(bytesOf(input)) },
  {
    id: "bin-decode", name: "From Binary", group: "Encoding",
    run: (input) => {
      const octets = input.replace(/[^01]/g, "").match(/.{8}/g) ?? [];
      return textOf(Uint8Array.from(octets, (octet) => parseInt(octet, 2)));
    },
  },
  {
    id: "bin-encode", name: "To Binary", group: "Encoding",
    run: (input) => [...bytesOf(input)].map((b) => b.toString(2).padStart(8, "0")).join(" "),
  },
  { id: "url-decode", name: "URL Decode", group: "Encoding", run: (input) => decodeURIComponent(input) },
  { id: "url-encode", name: "URL Encode", group: "Encoding", run: (input) => encodeURIComponent(input) },

  { id: "rot13", name: "ROT13", group: "Ciphers", run: (input) => caesar(input, 13) },
  {
    id: "caesar", name: "Caesar Shift", group: "Ciphers",
    args: [{ key: "shift", label: "Shift", type: "number", fallback: "3" }],
    run: (input, args) => caesar(input, Number(args.shift || 3)),
  },
  {
    id: "atbash", name: "Atbash", group: "Ciphers",
    run: (input) =>
      input.replace(/[a-z]/gi, (ch) => {
        const base = ch < "a" ? 65 : 97;
        return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base));
      }),
  },
  {
    id: "xor", name: "XOR (repeating key)", group: "Ciphers",
    args: [{ key: "key", label: "Key", type: "text", fallback: "key" }],
    run: (input, args) => {
      const key = bytesOf(args.key || "key");
      if (key.length === 0) return input;
      const data = bytesOf(input);
      // Output as hex: XOR output is rarely printable, and hex chains cleanly
      // into From Hex if you want the bytes back.
      return hexOf(data.map((byte, i) => byte ^ key[i % key.length]));
    },
  },

  { id: "reverse", name: "Reverse", group: "Text", run: (input) => [...input].reverse().join("") },
  { id: "upper", name: "Uppercase", group: "Text", run: (input) => input.toUpperCase() },
  { id: "lower", name: "Lowercase", group: "Text", run: (input) => input.toLowerCase() },
  { id: "strip", name: "Remove Whitespace", group: "Text", run: (input) => input.replace(/\s+/g, "") },

  { id: "sha1", name: "SHA-1", group: "Hashing", run: (input) => digest("SHA-1", input) },
  { id: "sha256", name: "SHA-256", group: "Hashing", run: (input) => digest("SHA-256", input) },
  { id: "sha512", name: "SHA-512", group: "Hashing", run: (input) => digest("SHA-512", input) },
];

const operationById = (id: string) => OPERATIONS.find((op) => op.id === id);
const GROUPS = [...new Set(OPERATIONS.map((op) => op.group))];

interface Step {
  opId: string;
  args: Record<string, string>;
}

function CipherBenchView({ emit }: AppProps) {
  const [input, setInput] = useState("");
  const [recipe, setRecipe] = useState<Step[]>([]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let value = input;
        for (const step of recipe) {
          const operation = operationById(step.opId);
          if (operation) value = await operation.run(value, step.args);
        }
        if (!cancelled) {
          setOutput(value);
          setError(null);
        }
      } catch (cause) {
        if (cancelled) return;
        setOutput("");
        // Bad input is the normal case here — someone pastes something that is
        // not base64 and needs to see why, not a blank box.
        setError(cause instanceof Error ? cause.message : "That input could not be processed.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [input, recipe]);

  function add(opId: string) {
    if (!opId) return;
    const operation = operationById(opId);
    if (!operation) return;

    const args = Object.fromEntries(
      (operation.args ?? []).map((arg) => [arg.key, arg.fallback]),
    );

    setRecipe((current) => [...current, { opId, args }]);
    emit("operation", { operation: opId });
  }

  const move = (index: number, by: number) =>
    setRecipe((current) => {
      const target = index + by;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <div>
        <label className="mb-1 block text-[10.5px] uppercase tracking-wider text-husky-faint">
          Input
        </label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="Paste something here"
          className="field selectable h-20 resize-none font-mono text-[12px]"
        />
      </div>

      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[10.5px] uppercase tracking-wider text-husky-faint">Recipe</span>
          <select
            onChange={(event) => {
              add(event.target.value);
              event.target.value = "";
            }}
            defaultValue=""
            className="ml-auto rounded-md border border-husky-edge bg-black/30 px-2 py-1 text-[11.5px] outline-none focus:border-husky-accent/70"
          >
            <option value="" disabled>+ Add operation</option>
            {GROUPS.map((group) => (
              <optgroup key={group} label={group}>
                {OPERATIONS.filter((op) => op.group === group).map((op) => (
                  <option key={op.id} value={op.id}>{op.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {recipe.length > 0 && (
            <button onClick={() => setRecipe([])} className="btn px-2 py-1 text-[11px]">
              Clear
            </button>
          )}
        </div>

        <div className="min-h-[52px] rounded-md border border-husky-edge bg-black/20 p-1.5">
          {recipe.length === 0 && (
            <p className="px-1.5 py-2 text-[11.5px] text-husky-faint">
              No operations yet. Add one above — they run top to bottom.
            </p>
          )}

          {recipe.map((step, index) => {
            const operation = operationById(step.opId);
            if (!operation) return null;

            return (
              <div
                key={`${step.opId}-${index}`}
                className="flex flex-wrap items-center gap-1.5 rounded px-1.5 py-1 hover:bg-white/5"
              >
                <span className="w-4 text-center font-mono text-[10px] text-husky-faint">
                  {index + 1}
                </span>
                <span className="text-[12px]">{operation.name}</span>

                {(operation.args ?? []).map((arg) => (
                  <label key={arg.key} className="flex items-center gap-1 text-[10.5px] text-husky-faint">
                    {arg.label}
                    <input
                      type={arg.type}
                      value={step.args[arg.key] ?? arg.fallback}
                      onChange={(event) =>
                        setRecipe((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, args: { ...item.args, [arg.key]: event.target.value } }
                              : item,
                          ),
                        )
                      }
                      className="w-16 rounded border border-husky-edge bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-husky-ink outline-none focus:border-husky-accent/70"
                    />
                  </label>
                ))}

                <span className="ml-auto flex items-center gap-0.5">
                  <button onClick={() => move(index, -1)} className="rounded p-0.5 text-husky-faint hover:bg-white/10 hover:text-husky-ink" aria-label="Move up">
                    <Icon name="ChevronUp" size={13} />
                  </button>
                  <button onClick={() => move(index, 1)} className="rounded p-0.5 text-husky-faint hover:bg-white/10 hover:text-husky-ink" aria-label="Move down">
                    <Icon name="ChevronDown" size={13} />
                  </button>
                  <button
                    onClick={() => setRecipe((current) => current.filter((_, i) => i !== index))}
                    className="rounded p-0.5 text-husky-faint hover:bg-husky-bad/70 hover:text-white"
                    aria-label={`Remove ${operation.name}`}
                  >
                    <Icon name="X" size={13} />
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[10.5px] uppercase tracking-wider text-husky-faint">Output</span>
          {output && (
            <button
              onClick={() => {
                void navigator.clipboard?.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="btn ml-auto px-2 py-0.5 text-[11px]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>

        <pre
          className={cn(
            "selectable min-h-[60px] flex-1 overflow-auto whitespace-pre-wrap break-all rounded-md border border-husky-edge bg-black/30 p-2.5 font-mono text-[12px]",
            error ? "text-husky-bad" : "text-husky-ink",
          )}
        >
          {error ?? output}
        </pre>
      </div>
    </div>
  );
}

export const cipherBench: DesktopApp = {
  id: "cipher-bench",
  title: "Cipher Bench",
  icon: "FlaskConical",
  opens: [],
  render: (props) => <CipherBenchView {...props} />,
};
