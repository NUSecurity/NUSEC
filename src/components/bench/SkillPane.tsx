import { getDomain, getSkill, resourcesFor, skillsByDomain } from "@/bench";
import { BenchState, Rung, rungLabels, rungMeanings, rungOrder } from "@/bench/types";
import { rungBelow } from "@/bench/url";
import Panel, { TileGroup } from "@/components/bench/Panel";
import ResourceList from "@/components/bench/ResourceList";
import TileRow from "@/components/bench/TileRow";
import { cn } from "@/lib/utils";

interface SkillPaneProps {
  state: BenchState;
  open: string | null;
  onToggleBrief: (id: string) => void;
  onChange: (patch: Partial<BenchState>) => void;
  onNext: () => void;
}

const rungIndex = (rung: Rung | null) => (rung ? rungOrder.indexOf(rung) : -1);

/** One rung above wherever the checkboxes say you are. Never two. */
const nextRung = (from: Rung | null): Rung =>
  rungOrder[rungIndex(from) + 1] ?? "teach";

const SkillPane = ({
  state,
  open,
  onToggleBrief,
  onChange,
  onNext,
}: SkillPaneProps) => {
  const skill = state.skill ? getSkill(state.skill) : null;
  const domain = skill ? getDomain(skill.domain) : null;

  /**
   * The ladder is cumulative: you can't have Build without Use. Ticking a rung
   * ticks everything below it; unticking one unticks everything above. That's
   * what keeps a student from claiming Build on something whose Use test they
   * never passed.
   */
  const setRung = (rung: Rung, checked: boolean) => {
    const from = checked ? rung : rungBelow(rung);
    onChange({ from, to: nextRung(from) });
  };

  const ready = Boolean(state.skill && state.to);

  return (
    <Panel
      step="Step 2 of 3"
      title="Pick one skill to move"
      intro="One capability, moved up exactly one level. Not “learn cloud security” — a specific thing, from wherever you are now to the next step, with a test you either passed or didn't. One is the right number."
      next={{
        label: ready ? "Next: pick your proof" : "Skip to proof for now",
        onClick: onNext,
        ready,
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {skillsByDomain.map(({ domain: group, skills }) => (
          <TileGroup key={group.id} label={group.name} hint={group.brief}>
            {skills.map((tile) => (
              <TileRow
                key={tile.id}
                tile={tile}
                selected={state.skill === tile.id}
                open={open === tile.id}
                onSelect={() =>
                  onChange(
                    state.skill === tile.id
                      ? { skill: null, from: null, to: null }
                      : { skill: tile.id, from: null, to: "recognize" },
                  )
                }
                onToggleBrief={() => onToggleBrief(tile.id)}
              />
            ))}
          </TileGroup>
        ))}
      </div>

      {skill && (
        <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Which of these have you already done?
          </h3>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Tick honestly — nobody sees this but you. We ask what you've done
            rather than what level you'd call yourself, because the checkbox
            version is the one that produces a plan that survives. Whatever you
            leave unticked first is where this bench takes you.
          </p>

          <ul className="mt-3 space-y-1.5">
            {rungOrder.map((rung) => {
              const checked = rungIndex(state.from) >= rungIndex(rung);
              const isTarget = state.to === rung;

              return (
                <li key={rung}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 rounded px-2 py-2 text-xs leading-relaxed transition-colors",
                      isTarget
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => setRung(rung, event.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[hsl(var(--primary))]"
                    />
                    <span>
                      <span
                        className={cn(
                          "font-semibold",
                          checked ? "text-primary" : "text-foreground/80",
                        )}
                      >
                        {rungLabels[rung]}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {rungMeanings[rung]}
                      </span>
                      {isTarget && (
                        <span className="ml-1.5 rounded border border-primary/50 px-1 text-[0.6rem] uppercase tracking-wider text-primary">
                          your next step
                        </span>
                      )}
                      <span className="mt-0.5 block text-foreground/80">
                        {skill.rungs[rung]}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {skill && domain && (
        <div className="rounded-lg border border-border bg-card/40 p-4">
          <h3 className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
            {domain.name} — where to learn this
          </h3>
          <p className="mb-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Five slots, each with a job. Fifteen links you can actually work
            through beats fifty you'll never open — that's the whole point of
            capping them.
          </p>

          {domain.depth === "stub" ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              We haven't built this pool yet, and we'd rather say so than hand
              you three links and call it a path.{" "}
              <a
                href="https://github.com/NUSecurity/NUSEC/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline underline-offset-2"
              >
                Here's how to build it
              </a>{" "}
              — and a merged pool is a Tier-1 proof of your own.
            </p>
          ) : (
            <ResourceList resources={resourcesFor(skill.id)} />
          )}
        </div>
      )}

      {!skill && (
        <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Pick a skill above and the ladder and its resources appear here.
        </p>
      )}
    </Panel>
  );
};

export default SkillPane;
