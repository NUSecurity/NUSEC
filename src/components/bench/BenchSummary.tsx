import { useState } from "react";
import { AlertTriangle, Check, Copy, Link2, Printer, ShieldAlert } from "lucide-react";
import { getArtifact, getPattern, getProve, getSkill, getTarget } from "@/bench";
import { CheckResult, closingSentence, isBlocked, runChecks } from "@/bench/checks";
import { benchComplete } from "@/bench/compose";
import { BenchState, horizonLabels, rungLabels } from "@/bench/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BenchSummaryProps {
  state: BenchState;
  onChange: (patch: Partial<BenchState>) => void;
}

/** A slot that hasn't been filled yet, rendered inline in the sentence. */
const Blank = ({ children }: { children: string }) => (
  <span className="rounded border border-dashed border-muted-foreground/50 px-1.5 py-0.5 text-sm text-muted-foreground">
    {children}
  </span>
);

const Sentence = ({
  label,
  children,
  done,
}: {
  label: string;
  children: React.ReactNode;
  done: boolean;
}) => (
  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 leading-relaxed">
    <span
      className={cn(
        "text-[0.65rem] font-semibold uppercase tracking-[0.2em]",
        done ? "text-primary" : "text-muted-foreground",
      )}
    >
      {label}
    </span>
    <span className="text-foreground">{children}</span>
  </p>
);

const BenchSummary = ({ state, onChange }: BenchSummaryProps) => {
  const [copied, setCopied] = useState(false);

  const checks = runChecks(state);
  const blocked = isBlocked(checks);
  const complete = benchComplete(state);
  const closing = closingSentence(state);

  const pattern = state.pattern ? getPattern(state.pattern) : null;
  const target = state.target ? getTarget(state.target) : null;
  const artifact = state.artifact ? getArtifact(state.artifact) : null;
  const skill = state.skill ? getSkill(state.skill) : null;
  const prove = state.prove ? getProve(state.prove) : null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard refused — the URL bar still has it */
    }
  };

  // The three first moves are the most useful thing to leave a meeting with,
  // so they're collected here rather than left inside three separate briefs.
  const firstMoves = [
    pattern && { label: "Project", text: pattern.first_move },
    skill && { label: "Skill", text: skill.first_move },
    prove && { label: "Prove", text: prove.first_move },
  ].filter(Boolean) as { label: string; text: string }[];

  return (
    <section className="rounded-lg border border-border bg-card/60 p-5 print:border-0 print:bg-transparent print:p-0">
      <div className="space-y-2.5">
        <Sentence label="Project" done={Boolean(pattern && target && artifact)}>
          I am{" "}
          {pattern ? (
            <span className="font-medium text-primary">{pattern.verb}</span>
          ) : (
            <Blank>pattern</Blank>
          )}{" "}
          {target ? (
            <span className="font-medium text-primary">{target.phrase}</span>
          ) : (
            <Blank>target</Blank>
          )}
          , producing{" "}
          {artifact ? (
            <span className="font-medium text-primary">{artifact.phrase}</span>
          ) : (
            <Blank>artifact</Blank>
          )}
          .
        </Sentence>

        <Sentence label="Skill" done={Boolean(skill && state.to)}>
          I am moving{" "}
          {skill ? (
            <span className="font-medium text-primary">{skill.name}</span>
          ) : (
            <Blank>skill</Blank>
          )}{" "}
          from{" "}
          {state.from ? (
            <span className="font-medium text-primary">
              {rungLabels[state.from]}
            </span>
          ) : (
            <span className="font-medium text-primary">nothing yet</span>
          )}{" "}
          to{" "}
          {state.to ? (
            <span className="font-medium text-primary">{rungLabels[state.to]}</span>
          ) : (
            <Blank>rung</Blank>
          )}
          .
        </Sentence>

        <Sentence label="Prove" done={Boolean(prove)}>
          I am putting{" "}
          {artifact ? (
            <span className="font-medium text-primary">{artifact.phrase}</span>
          ) : (
            <Blank>artifact</Blank>
          )}{" "}
          through{" "}
          {prove ? (
            <span className="font-medium text-primary">{prove.name}</span>
          ) : (
            <Blank>a gate</Blank>
          )}
          , which can reject it.
        </Sentence>
      </div>

      {/* Coherence checks. Blocks are loud; advisories explain and move on. */}
      {checks.length > 0 && (
        <ul className="mt-4 space-y-2">
          {checks.map((check: CheckResult) => (
            <li
              key={check.id}
              className={cn(
                "flex items-start gap-2 rounded-md border px-3 py-2 text-xs leading-relaxed",
                check.severity === "block"
                  ? "border-destructive/60 bg-destructive/10"
                  : "border-border bg-secondary/40",
              )}
            >
              {check.severity === "block" ? (
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span>
                <span
                  className={cn(
                    "font-medium",
                    check.severity === "block"
                      ? "text-destructive"
                      : "text-foreground/90",
                  )}
                >
                  {check.message}
                </span>
                {check.detail && (
                  <span className="block text-muted-foreground">{check.detail}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* The closing sentence: where a disconnected bench gets named out loud. */}
      {closing && (
        <p
          className={cn(
            "mt-4 rounded-md border-l-2 px-3 py-2 text-sm italic leading-relaxed",
            closing.includes("Those connect")
              ? "border-primary bg-primary/5 text-foreground"
              : "border-muted-foreground bg-secondary/40 text-muted-foreground",
          )}
        >
          {closing}
        </p>
      )}

      {firstMoves.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Do these this week
          </h3>
          <ul className="mt-1.5 space-y-1.5">
            {firstMoves.map((move) => (
              <li key={move.label} className="flex items-start gap-2 text-xs">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>
                  <span className="font-semibold text-foreground/70">
                    {move.label}:
                  </span>{" "}
                  <span className="text-muted-foreground">{move.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 print:hidden">
        <div className="mr-auto flex items-center gap-1.5">
          {(["term", "year"] as const).map((horizon) => (
            <button
              key={horizon}
              type="button"
              onClick={() => onChange({ horizon })}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition-colors",
                state.horizon === horizon
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/60",
              )}
            >
              {horizonLabels[horizon]}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={copyLink}
          disabled={!complete || blocked}
          title={
            blocked
              ? "Resolve the block before sharing"
              : complete
                ? "Copy this bench's URL"
                : "Fill all three fields first"
          }
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy link"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => window.print()}
          disabled={!complete || blocked}
          title={complete ? "Print this bench" : "Fill all three fields first"}
        >
          <Printer />
          Print
        </Button>
      </div>

      {complete && !blocked && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground print:hidden">
          <Link2 className="mt-0.5 h-3 w-3 shrink-0" />
          Your whole bench is in this page's URL. Paste it into Slack or a co-op
          application — no account, nothing stored, and it still resolves later.
        </p>
      )}
    </section>
  );
};

export default BenchSummary;
