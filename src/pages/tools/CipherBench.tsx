import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import { Button } from "@/components/ui/button";
import { getChallenge } from "@/ctf/meetings";
import { cipherOps, opById, runRecipe } from "@/lib/cipherOps";
import { cn } from "@/lib/utils";

/** Pre-loaded so the challenge text is one click away, not a copy-paste job. */
const challengeText =
  getChallenge("hands-on-practice", "obscure-encryption")?.challenge.content ?? "";

const flagPattern = /NUSEC\{[^}]*\}/;

const groupLabels = {
  encode: "Encode",
  decode: "Decode",
} as const;

/**
 * /tools/cipher — a pocket-sized CyberChef. Operations stack into a recipe and
 * every step shows its own output, so the order can be worked out by watching
 * the text rather than by knowing the answer in advance.
 */
const CipherBench = () => {
  const [input, setInput] = useState(challengeText);
  const [recipe, setRecipe] = useState<string[]>([]);

  const steps = useMemo(() => runRecipe(input, recipe), [input, recipe]);

  const output = recipe.length === 0 ? input : (steps[steps.length - 1]?.output ?? "");
  const failed = steps.some((step) => step.error);
  const flag = failed ? null : output.match(flagPattern)?.[0];

  const add = (id: string) => setRecipe((current) => [...current, id]);
  const remove = (at: number) =>
    setRecipe((current) => current.filter((_, index) => index !== at));

  const move = (at: number, by: number) =>
    setRecipe((current) => {
      const target = at + by;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[at], next[target]] = [next[target], next[at]];
      return next;
    });

  return (
    <CtfLayout wide>
      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Cipher Bench
          </span>
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          Stack operations into a recipe and they run top to bottom. Every step
          shows what it produced, so you can find the right order by watching the
          text change. Half of these encode and half decode — if you are unwrapping
          something, you only need one of those halves.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="space-y-5">
          {(["decode", "encode"] as const).map((group) => (
            <section key={group}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {groupLabels[group]}
              </h2>

              <div className="space-y-2">
                {cipherOps
                  .filter((op) => op.group === group)
                  .map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => add(op.id)}
                      className={cn(
                        "group flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left transition-colors",
                        "border-border bg-secondary/40 hover:border-primary/60",
                      )}
                    >
                      <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      <span className="min-w-0">
                        <span className="block font-mono text-sm text-foreground transition-colors group-hover:text-primary">
                          {op.name}
                        </span>
                        <span className="block text-xs leading-snug text-muted-foreground">
                          {op.hint}
                        </span>
                      </span>
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </aside>

        <div className="space-y-6">
          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Input
              </h2>
              <div className="flex gap-2">
                {challengeText && input !== challengeText && (
                  <Button size="sm" variant="outline" onClick={() => setInput(challengeText)}>
                    Load challenge text
                  </Button>
                )}
                {input && (
                  <Button size="sm" variant="outline" onClick={() => setInput("")}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              rows={3}
              aria-label="Input text"
              className="w-full resize-y rounded-md border border-input bg-secondary px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Paste something to work on"
            />
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Recipe
              </h2>
              {recipe.length > 0 && (
                <Button size="sm" variant="outline" onClick={() => setRecipe([])}>
                  Remove all
                </Button>
              )}
            </div>

            {recipe.length === 0 ? (
              <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                Pick an operation on the left to start the recipe.
              </p>
            ) : (
              <ol className="space-y-2">
                {recipe.map((id, index) => {
                  const op = opById(id);
                  const step = steps[index];

                  return (
                    <li
                      key={`${id}-${index}`}
                      className={cn(
                        "rounded-md border px-3 py-2",
                        step?.error
                          ? "border-destructive/60 bg-destructive/5"
                          : "border-border bg-secondary/40",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 shrink-0 font-mono text-xs text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
                          {op?.name ?? id}
                        </span>

                        <button
                          type="button"
                          aria-label="Move up"
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                          className="rounded p-1 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          disabled={index === recipe.length - 1}
                          onClick={() => move(index, 1)}
                          className="rounded p-1 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Remove"
                          onClick={() => remove(index)}
                          className="rounded p-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p
                        className={cn(
                          "mt-1 break-all pl-7 font-mono text-xs",
                          step?.error ? "text-destructive" : "text-muted-foreground",
                        )}
                      >
                        {step?.error ?? step?.output.slice(0, 180) ?? ""}
                        {!step?.error && (step?.output.length ?? 0) > 180 && " …"}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Output
            </h2>

            <pre
              className={cn(
                "min-h-[4.5rem] whitespace-pre-wrap break-all rounded-lg border px-4 py-3 font-mono text-sm",
                flag
                  ? "border-green-500/60 bg-green-500/10 text-green-400"
                  : "border-border bg-cyber-darker text-foreground",
              )}
            >
              {output}
            </pre>

            {flag && (
              <p className="mt-2 text-sm text-green-400">
                That looks like a flag — submit it on the challenge page.
              </p>
            )}
          </section>
        </div>
      </div>
    </CtfLayout>
  );
};

export default CipherBench;
