import { getDomain, getSkill, resourcesFor, skills, skillsByDomain } from "@/bench";
import {
  BenchState,
  Rung,
  rungLabels,
  rungMeanings,
  rungOrder,
} from "@/bench/types";
import { rungBelow } from "@/bench/url";
import Panel from "@/components/bench/Panel";
import TileDetail from "@/components/bench/TileDetail";
import TileRow from "@/components/bench/TileRow";
import { cn } from "@/lib/utils";

interface SkillPaneProps {
  state: BenchState;
  open: string | null;
  onOpen: (id: string | null) => void;
  onChange: (patch: Partial<BenchState>) => void;
  onNext: () => void;
}

const rungIndex = (rung: Rung | null) => (rung ? rungOrder.indexOf(rung) : -1);

/** One rung above wherever the checkboxes say you are. Never two. */
const nextRung = (from: Rung | null): Rung =>
  rungOrder[rungIndex(from) + 1] ?? "teach";

/**
 * Skill on the left, the ladder on the right. Both scroll independently, so
 * ticking a rung doesn't move the list you were reading.
 */
const SkillPane = ({ state, open, onOpen, onChange, onNext }: SkillPaneProps) => {
  const skill = state.skill ? getSkill(state.skill) : null;
  const domain = skill ? getDomain(skill.domain) : null;
  const openSkill = skills.find((s) => s.id === open);

  /**
   * The ladder is cumulative: you can't have Build without Use. Ticking a rung
   * ticks everything below; unticking one unticks everything above. That's
   * what stops someone claiming Build on a skill whose Use test they never
   * passed.
   */
  const setRung = (rung: Rung, checked: boolean) => {
    const from = checked ? rung : rungBelow(rung);
    onChange({ from, to: nextRung(from) });
  };

  const ready = Boolean(state.skill && state.to);

  const ladder = (target: NonNullable<typeof skill>) => (
    <ul className="space-y-1.5">
      {rungOrder.map((rung) => {
        const checked = rungIndex(state.from) >= rungIndex(rung);
        const isTarget = state.to === rung && state.skill === target.id;

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
                checked={state.skill === target.id && checked}
                disabled={state.skill !== target.id}
                onChange={(event) => setRung(rung, event.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[hsl(var(--primary))] disabled:opacity-40"
              />
              <span>
                <span
                  className={cn(
                    "font-semibold",
                    checked && state.skill === target.id
                      ? "text-primary"
                      : "text-foreground/80",
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
                  {target.rungs[rung]}
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Panel
      step="Step 2 of 3"
      title="Pick one skill to move"
      intro="One capability, moved up exactly one level. Not “learn cloud security” — a specific thing, from wherever you are now to the next step, with a test you either passed or didn't. One is the right number."
      scrollBody={false}
      next={{
        label: ready ? "Next: pick your proof" : "Skip to proof for now",
        onClick: onNext,
        ready,
      }}
    >
      <div className="grid min-h-0 gap-5 lg:h-full lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid min-h-0 gap-5 sm:grid-cols-2">
          {[0, 1].map((half) => (
            <div key={half} className="flex min-h-0 flex-col gap-4 lg:overflow-y-auto lg:pr-1">
              {skillsByDomain
                .filter((_, index) => index % 2 === half)
                .map(({ domain: group, skills: groupSkills }) => (
                  <div key={group.id}>
                    <h3 className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                      {group.name}
                    </h3>
                    <div className="space-y-1.5">
                      {groupSkills.map((tile) => (
                        <TileRow
                          key={tile.id}
                          tile={tile}
                          selected={state.skill === tile.id}
                          onSelect={() =>
                            onChange(
                              state.skill === tile.id
                                ? { skill: null, from: null, to: null }
                                : { skill: tile.id, from: null, to: "recognize" },
                            )
                          }
                          onOpen={() => onOpen(tile.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-col lg:overflow-y-auto lg:pr-1">
          {skill && domain ? (
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Which of these have you done?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Tick honestly — nobody sees this but you. Whatever you leave
                unticked first is where this bench takes you.
              </p>
              <div className="mt-3">{ladder(skill)}</div>

              <button
                type="button"
                onClick={() => onOpen(skill.id)}
                className="mt-3 text-xs text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Read about this skill and its resources →
              </button>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Pick a skill and the ladder appears here.
            </p>
          )}
        </div>
      </div>

      {openSkill && (
        <TileDetail
          tile={openSkill}
          kind={`Skill · ${getDomain(openSkill.domain).name}`}
          resources={resourcesFor(openSkill.id)}
          resourcesLabel="Learning this"
          selected={state.skill === openSkill.id}
          onSelect={() =>
            onChange({ skill: openSkill.id, from: null, to: "recognize" })
          }
          onClose={() => onOpen(null)}
        >
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              The four levels
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Each one is something you did or didn't do, never a rating.
            </p>
            <div className="mt-2">{ladder(openSkill)}</div>
          </div>
        </TileDetail>
      )}
    </Panel>
  );
};

export default SkillPane;
