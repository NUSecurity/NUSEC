import { useState } from "react";
import { Check, Copy, Lock, Pencil, Printer } from "lucide-react";
import {
  getArtifact,
  getPattern,
  getProve,
  getSkill,
  getTarget,
  presets,
} from "@/bench";
import { BenchState, Preset, rungLabels } from "@/bench/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Step = "project" | "skill" | "prove" | "review";

interface BenchRailProps {
  state: BenchState;
  step: Step;
  onStep: (step: Step) => void;
  onLoadPreset: (bench: Preset["bench"]) => void;
  /** All three fields resolved. */
  complete: boolean;
  blocked: boolean;
}

/**
 * The left rail: how to start, where you are, what you've picked, and how to
 * get it out.
 *
 * Building your own is the default and sits at the top, because that's what
 * the tool is for. The examples underneath are a way in for anyone who'd
 * rather see a finished one first — loading one fills all three fields, and
 * the student can then change whichever bits don't suit them.
 */
const BenchRail = ({
  state,
  step,
  onStep,
  onLoadPreset,
  complete,
  blocked,
}: BenchRailProps) => {
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
        onClick={() => onStep("project")}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
          step !== "review"
            ? "border-primary bg-primary/20 text-foreground"
            : "border-border bg-secondary/30 text-foreground hover:border-primary/60",
        )}
      >
        <Pencil className="h-4 w-4 shrink-0 text-primary" />
        <span>
          <span className="block font-medium">Build my own</span>
          <span className="block text-xs text-muted-foreground">
            Start from step one
          </span>
        </span>
      </button>

      <div className="mt-1">
        <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Or start from an example
        </h2>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          Loads all three, then change whatever doesn't suit you.
        </p>

        <div className="mt-2 flex flex-col gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              onClick={() => onLoadPreset(preset.bench)}
              title={preset.who}
              className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-left text-xs transition-colors hover:border-primary/60 hover:bg-secondary/50"
            >
              <span className="block font-medium text-foreground">
                {preset.title}
              </span>
              <span className="mt-0.5 block leading-snug text-muted-foreground">
                {preset.who}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="my-2 border-t border-border" />

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
                ? "border-primary bg-primary/20"
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
            ? "border-primary bg-primary/20 text-foreground"
            : complete
              ? "border-border bg-secondary/30 text-foreground hover:border-primary/60"
              : "cursor-not-allowed border-border/50 bg-secondary/20 text-muted-foreground/60",
        )}
      >
        {complete ? (
          <Check className="h-4 w-4 shrink-0 text-primary" />
        ) : (
          <Lock className="h-4 w-4 shrink-0" />
        )}
        <span>
          <span className="block font-medium">Your bench</span>
          <span className="block text-xs text-muted-foreground">
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
