import { useState } from "react";
import { Check, Copy, Lightbulb, Lock, Printer } from "lucide-react";
import { getArtifact, getPattern, getProve, getSkill, getTarget } from "@/bench";
import { BenchState, rungLabels } from "@/bench/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Step = "examples" | "project" | "skill" | "prove" | "review";

interface BenchRailProps {
  state: BenchState;
  step: Step;
  onStep: (step: Step) => void;
  /** All three fields resolved and no hard block outstanding. */
  complete: boolean;
  blocked: boolean;
}

/**
 * The left rail: where you are, what you've picked, and how to get it out.
 *
 * Three fields on one screen was too much at once, especially for someone who
 * has never seen the vocabulary. One field at a time, with the rail showing
 * what's already decided, turns it from a wall into three small questions.
 */
const BenchRail = ({ state, step, onStep, complete, blocked }: BenchRailProps) => {
  const [copied, setCopied] = useState(false);

  const projectValue =
    state.pattern && state.target
      ? `${getPattern(state.pattern).name} · ${getTarget(state.target).name}${
          state.artifact ? ` · ${getArtifact(state.artifact).name}` : ""
        }`
      : state.pattern
        ? getPattern(state.pattern).name
        : null;

  const skillValue =
    state.skill && state.to
      ? `${getSkill(state.skill).name} → ${rungLabels[state.to]}`
      : state.skill
        ? getSkill(state.skill).name
        : null;

  const proveValue = state.prove ? getProve(state.prove).name : null;

  const steps: {
    id: Step;
    n: number;
    label: string;
    hint: string;
    value: string | null;
  }[] = [
    {
      id: "project",
      n: 1,
      label: "Project",
      hint: "Build something real",
      value: projectValue,
    },
    {
      id: "skill",
      n: 2,
      label: "Skill",
      hint: "Move one thing up a level",
      value: skillValue,
    },
    {
      id: "prove",
      n: 3,
      label: "Prove",
      hint: "Get objective proof of it",
      value: proveValue,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard refused — the URL bar still has it */
    }
  };

  return (
    <nav className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onStep("examples")}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
          step === "examples"
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/60 hover:text-foreground",
        )}
      >
        <Lightbulb className="h-4 w-4 shrink-0" />
        <span>
          <span className="block font-medium">Examples</span>
          <span className="block text-xs opacity-80">
            New here? Start from one of these
          </span>
        </span>
      </button>

      <div className="my-1 border-t border-border" />

      {steps.map(({ id, n, label, hint, value }) => {
        const active = step === id;
        const done = Boolean(value);

        return (
          <button
            key={id}
            type="button"
            onClick={() => onStep(id)}
            className={cn(
              "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
              active
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary/30 hover:border-primary/60",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold",
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "border border-primary text-primary"
                    : "border border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : n}
            </span>

            <span className="min-w-0">
              <span
                className={cn(
                  "block text-sm font-medium",
                  active || done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                {value ?? hint}
              </span>
            </span>
          </button>
        );
      })}

      <div className="my-1 border-t border-border" />

      {/* The holistic view, deliberately gated until there's something to see.
          An empty summary reads as a broken page. */}
      <button
        type="button"
        onClick={() => complete && onStep("review")}
        disabled={!complete}
        title={complete ? undefined : "Fill in all three first"}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
          step === "review"
            ? "border-primary bg-primary/10 text-primary"
            : complete
              ? "border-border bg-secondary/30 text-foreground hover:border-primary/60"
              : "cursor-not-allowed border-border/50 bg-secondary/20 text-muted-foreground/60",
        )}
      >
        {complete ? (
          <Check className="h-4 w-4 shrink-0" />
        ) : (
          <Lock className="h-4 w-4 shrink-0" />
        )}
        <span>
          <span className="block font-medium">Your bench</span>
          <span className="block text-xs opacity-80">
            {complete ? "All three together" : "Unlocks when all three are set"}
          </span>
        </span>
      </button>

      <div className="mt-3 rounded-lg border border-border bg-card/40 p-3">
        <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Export
        </h2>
        <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
          {blocked
            ? "One thing needs sorting first — see the note on your Project."
            : complete
              ? "Your whole bench lives in this page's URL. Nothing is stored."
              : "Available once all three are filled in."}
        </p>

        <div className="mt-2.5 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyLink}
            disabled={!complete || blocked}
            className="justify-start"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy link"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            disabled={!complete || blocked}
            className="justify-start"
          >
            <Printer />
            Print or save PDF
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default BenchRail;
