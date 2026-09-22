import { ExternalLink } from "lucide-react";
import {
  getArtifact,
  getPattern,
  getProve,
  getSkill,
  getTarget,
  resourcesFor,
} from "@/bench";
import { BenchState, rungLabels, windowTypeLabels } from "@/bench/types";
import BenchSentences from "@/components/bench/BenchSentences";
import ResourceList from "@/components/bench/ResourceList";

const Card = ({
  label,
  title,
  onOpen,
  children,
}: {
  label: string;
  title: string;
  onOpen?: () => void;
  children: React.ReactNode;
}) => (
  <section className="rounded-lg border border-border bg-card/40 p-4">
    <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
      {label}
    </h3>
    <p className="mt-1 text-base font-medium text-foreground">{title}</p>
    <div className="mt-3 space-y-3 text-xs leading-relaxed">{children}</div>
    {onOpen && (
      <button
        type="button"
        onClick={onOpen}
        className="mt-3 text-xs text-primary underline underline-offset-2 hover:text-primary/80"
      >
        Read more →
      </button>
    )}
  </section>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <p>
    <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
      {label}
    </span>
    <span className="mt-0.5 block text-foreground/90">{children}</span>
  </p>
);

/**
 * The whole bench in one place, once all three fields resolve.
 *
 * This is the view a student actually leaves with — it collects the three
 * sentences, what each choice commits them to, where each one starts, and the
 * resources behind the skill they picked.
 */
const ReviewPanel = ({
  state,
  onOpen,
}: {
  state: BenchState;
  /** Opens a tile's full-screen view from the summary cards. */
  onOpen: (id: string) => void;
}) => {
  const pattern = state.pattern ? getPattern(state.pattern) : null;
  const target = state.target ? getTarget(state.target) : null;
  const artifact = state.artifact ? getArtifact(state.artifact) : null;
  const skill = state.skill ? getSkill(state.skill) : null;
  const prove = state.prove ? getProve(state.prove) : null;

  return (
    <div className="min-h-0 flex-1 space-y-5 lg:overflow-y-auto lg:pr-1">
      <section className="rounded-lg border border-primary/40 bg-primary/5 p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Your bench
        </h2>
        <BenchSentences state={state} />
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {pattern && target && artifact && (
          <Card
            label="Project"
            title={`${pattern.name} · ${target.name}`}
            onOpen={() => onOpen(pattern.id)}
          >
            <Field label="Where to start">{pattern.first_move}</Field>
            <Field label="Where to get one">{target.sourcing}</Field>
            <Field label="Common pitfalls">{target.gotchas}</Field>
            <Field label="You'll end up with">{artifact.brief}</Field>
          </Card>
        )}

        {skill && state.to && (
          <Card
            label="Skill"
            title={`${skill.name} → ${rungLabels[state.to]}`}
            onOpen={() => onOpen(skill.id)}
          >
            <Field label="Where to start">{skill.first_move}</Field>
            <Field label={`What ${rungLabels[state.to]} means`}>
              {skill.rungs[state.to]}
            </Field>
            <Field label="Common pitfalls">{skill.failure_mode}</Field>
          </Card>
        )}

        {prove && (
          <Card
            label="Prove"
            title={prove.name}
            onOpen={() => onOpen(prove.id)}
          >
            <Field label="Where to start">{prove.first_move}</Field>
            <Field label="Who can say no">{prove.gatekeeper}</Field>
            <Field label={`Timing — ${windowTypeLabels[prove.window.type]}`}>
              {prove.window.note} {prove.lead_time}.
            </Field>
            <Field label="Cost">{prove.cost}</Field>
          </Card>
        )}
      </div>

      {/* Links attached to the two tiles that have somewhere concrete to go. */}
      {((target?.links?.length ?? 0) > 0 || (prove?.links?.length ?? 0) > 0) && (
        <section className="rounded-lg border border-border bg-card/40 p-4">
          <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Go here next
          </h2>
          <ul className="mt-2 space-y-1.5">
            {[...(target?.links ?? []), ...(prove?.links ?? [])].map((link) => (
              <li key={link.url}>
                {link.last_verified ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-start gap-1.5 text-xs text-foreground hover:text-primary"
                  >
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-60" />
                    <span className="group-hover:underline">{link.title}</span>
                  </a>
                ) : (
                  <span className="flex items-start gap-1.5 text-xs text-foreground">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                    />
                    {link.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {skill && (
        <section className="rounded-lg border border-border bg-card/40 p-4">
          <h2 className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Resources for {skill.name}
          </h2>
          <ResourceList resources={resourcesFor(skill.id)} />
        </section>
      )}

      <section className="rounded-lg border border-border bg-secondary/30 p-4">
        <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          When to come back
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          When any one of the three finishes, rebuild all three. Finishing the
          project changes what proof is open to you; passing the gate changes
          what the next skill should be. They're linked, so finishing one makes
          the other two's assumptions out of date. No deadlines and no check-in
          schedule — just come back when something lands.
        </p>
      </section>
    </div>
  );
};

export default ReviewPanel;
