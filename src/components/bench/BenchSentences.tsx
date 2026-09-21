import { getArtifact, getPattern, getProve, getSkill, getTarget } from "@/bench";
import { BenchState, rungLabels } from "@/bench/types";
import { cn } from "@/lib/utils";

/** A slot nobody has filled yet. */
const Blank = ({ children }: { children: string }) => (
  <span className="rounded border border-dashed border-muted-foreground/50 px-1.5 py-0.5 text-[0.85em] text-muted-foreground print:border-neutral-400">
    {children}
  </span>
);

const Pick = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-primary print:text-black print:underline">
    {children}
  </span>
);

const Line = ({
  label,
  done,
  children,
}: {
  label: string;
  done: boolean;
  children: React.ReactNode;
}) => (
  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 leading-relaxed">
    <span
      className={cn(
        "text-[0.65rem] font-semibold uppercase tracking-[0.2em]",
        done ? "text-primary" : "text-muted-foreground",
        "print:text-neutral-500",
      )}
    >
      {label}
    </span>
    <span className="text-foreground">{children}</span>
  </p>
);

/**
 * The bench as three sentences.
 *
 * The template is fixed on purpose: every student's bench reads the same
 * shape, which makes them comparable in a room and impossible to fill with
 * mush. Shared by the review panel and the print sheet so the wording can
 * never drift between screen and paper.
 */
const BenchSentences = ({ state }: { state: BenchState }) => {
  const pattern = state.pattern ? getPattern(state.pattern) : null;
  const target = state.target ? getTarget(state.target) : null;
  const artifact = state.artifact ? getArtifact(state.artifact) : null;
  const skill = state.skill ? getSkill(state.skill) : null;
  const prove = state.prove ? getProve(state.prove) : null;

  return (
    <div className="space-y-2.5">
      <Line label="Project" done={Boolean(pattern && target && artifact)}>
        I am {pattern ? <Pick>{pattern.verb}</Pick> : <Blank>a pattern</Blank>}{" "}
        {target ? <Pick>{target.phrase}</Pick> : <Blank>a target</Blank>},
        producing{" "}
        {artifact ? <Pick>{artifact.phrase}</Pick> : <Blank>an artifact</Blank>}.
      </Line>

      <Line label="Skill" done={Boolean(skill && state.to)}>
        I am moving {skill ? <Pick>{skill.name}</Pick> : <Blank>a skill</Blank>}{" "}
        from{" "}
        {state.from ? (
          <Pick>{rungLabels[state.from]}</Pick>
        ) : (
          <Pick>where I am now</Pick>
        )}{" "}
        to {state.to ? <Pick>{rungLabels[state.to]}</Pick> : <Blank>a rung</Blank>}
        .
      </Line>

      <Line label="Prove" done={Boolean(prove)}>
        I am putting{" "}
        {artifact ? <Pick>{artifact.phrase}</Pick> : <Blank>my artifact</Blank>}{" "}
        through {prove ? <Pick>{prove.name}</Pick> : <Blank>a gate</Blank>}, which
        can reject it.
      </Line>
    </div>
  );
};

export default BenchSentences;
