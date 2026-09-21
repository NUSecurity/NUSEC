import { getDomain, getSkill, resourcesFor, skillsByDomain } from "@/bench";
import { BenchState, Rung, rungLabels, rungMeanings, rungOrder } from "@/bench/types";
import { rungBelow } from "@/bench/url";
import FieldPane, { TileGroup } from "@/components/bench/FieldPane";
import ResourceList from "@/components/bench/ResourceList";
import TileRow from "@/components/bench/TileRow";
import { cn } from "@/lib/utils";

interface SkillPaneProps {
  state: BenchState;
  open: string | null;
  onToggleBrief: (id: string) => void;
  onChange: (patch: Partial<BenchState>) => void;
}

const rungIndex = (rung: Rung | null) =>
  rung ? rungOrder.indexOf(rung) : -1;

/** One rung above wherever the checkboxes say you are. Never two. */
const nextRung = (from: Rung | null): Rung =>
  rungOrder[rungIndex(from) + 1] ?? "teach";

const SkillPane = ({ state, open, onToggleBrief, onChange }: SkillPaneProps) => {
  const skill = state.skill ? getSkill(state.skill) : null;
  const domain = skill ? getDomain(skill.domain) : null;

  /**
   * The ladder is cumulative: you cannot have Build without Use. Ticking a rung
   * ticks everything below it; unticking one unticks everything above. That
   * constraint is what stops the inflated bench — a student claiming Build on a
   * skill whose Use test they never passed.
   */
  const setRung = (rung: Rung, checked: boolean) => {
    const from = checked ? rung : rungBelow(rung);
    onChange({ from, to: nextRung(from) });
  };

  return (
    <FieldPane
      title="Skill"
      brief="Pick one capability and move it up one rung. Not “learn cloud security” — a specific thing, from where you are to the next level, with a test you either passed or didn't."
      resolved={Boolean(state.skill && state.to)}
    >
      {skillsByDomain.map(({ domain: group, skills }) => (
        <TileGroup
          key={group.id}
          label={group.name}
          hint={group.depth === "stub" ? undefined : group.brief}
        >
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

      {/* Rung self-assessment, shown once a skill is picked. */}
      {skill && (
        <div className="rounded-md border border-primary/40 bg-primary/5 p-3">
          <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Which of these have you done?
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tick honestly. The tool asks what you've done, never what level you
            think you're at — the checkbox version is the one that produces a
            plan that survives.
          </p>

          <ul className="mt-2.5 space-y-1.5">
            {rungOrder.map((rung) => {
              const checked = rungIndex(state.from) >= rungIndex(rung);
              const isTarget = state.to === rung;

              return (
                <li key={rung}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 text-xs leading-relaxed transition-colors",
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
                          your move
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

      {/* Resources: the domain's pool plus whatever is specific to this skill. */}
      {skill && domain && (
        <div className="rounded-md border border-border bg-secondary/30 p-3">
          <h3 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-foreground/70">
            {domain.name} resources
          </h3>

          {domain.depth === "stub" ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Not built yet. {domain.name} has tiles but no curated path — we'd
              rather say so than hand you three links and call it a domain.{" "}
              <a
                href="https://github.com/NUSecurity/NUSEC/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline underline-offset-2"
              >
                Here's how to build it
              </a>{" "}
              — a merged pool is a Tier-1 Prove item of your own.
            </p>
          ) : (
            <ResourceList resources={resourcesFor(skill.id)} />
          )}
        </div>
      )}
    </FieldPane>
  );
};

export default SkillPane;
