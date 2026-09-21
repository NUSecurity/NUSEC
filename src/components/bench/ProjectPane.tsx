import { artifacts, getKit, getPattern, getTarget, kits, patterns, targets } from "@/bench";
import { commonArtifacts, commonPatterns, commonTargets } from "@/bench/compose";
import { runChecks } from "@/bench/checks";
import {
  BenchState,
  KitId,
  authorizationAttestation,
  authorizationLabels,
  selfSatisfiable,
  targetClassLabels,
} from "@/bench/types";
import ChecksList from "@/components/bench/ChecksList";
import Panel, { TileGroup } from "@/components/bench/Panel";
import ResourceList from "@/components/bench/ResourceList";
import TileRow from "@/components/bench/TileRow";
import { cn } from "@/lib/utils";

interface ProjectPaneProps {
  state: BenchState;
  open: string | null;
  onToggleBrief: (id: string) => void;
  onChange: (patch: Partial<BenchState>) => void;
  onNext: () => void;
}

/**
 * Pattern × Target × Artifact, as three columns.
 *
 * Every combination is selectable. Picking a pattern marks the targets and
 * artifacts it's most often paired with, and that's the whole of it — the
 * unusual pairings are frequently the interesting ones, and the tool has no
 * business ruling them out.
 *
 * Targets are ordered software first. That's not a claim about what matters;
 * it's a claim about what this room turns up wanting to do.
 */
const ProjectPane = ({
  state,
  open,
  onToggleBrief,
  onChange,
  onNext,
}: ProjectPaneProps) => {
  const usualPatterns = new Set(commonPatterns(state).map((p) => p.id));
  const usualTargets = new Set(commonTargets(state).map((t) => t.id));
  const usualArtifacts = new Set(commonArtifacts(state).map((a) => a.id));

  const pattern = state.pattern ? getPattern(state.pattern) : null;
  const target = state.target ? getTarget(state.target) : null;
  const needsAttestation =
    target && !selfSatisfiable.includes(target.authorization);

  // Only the project-side checks belong in this panel.
  const checks = runChecks(state).filter(
    (check) => check.id === "authorization" || check.id.startsWith("kit-") || check.id === "effort",
  );

  const toggleKit = (id: KitId) =>
    onChange({
      kits: state.kits.includes(id)
        ? state.kits.filter((kit) => kit !== id)
        : [...state.kits, id],
    });

  const ready = Boolean(state.pattern && state.target && state.artifact);

  return (
    <Panel
      step="Step 1 of 3"
      title="Pick a project"
      intro="Something that didn't exist before you sat down, ending in a thing with a URL that someone can look at without you in the room. Pick what you'd do, what you'd do it to, and what you'll have at the end."
      next={{
        label: ready ? "Next: pick a skill" : "Skip to skill for now",
        onClick: onNext,
        ready,
      }}
    >
      <p className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Everything here is something you own, something built to be attacked, or
        something published for anyone to use. University systems aren't on this
        list and won't be — if you want to test one, go through the university's
        own disclosure channel instead.
      </p>

      <div className="grid gap-5 lg:grid-cols-3">
        <TileGroup
          label="Pattern"
          hint="What you'd do."
          count={`${patterns.length} to choose from`}
        >
          {patterns.map((tile) => (
            <TileRow
              key={tile.id}
              tile={tile}
              selected={state.pattern === tile.id}
              common={
                (Boolean(state.target) || Boolean(state.artifact)) &&
                usualPatterns.has(tile.id)
              }
              open={open === tile.id}
              onSelect={() =>
                onChange({ pattern: state.pattern === tile.id ? null : tile.id })
              }
              onToggleBrief={() => onToggleBrief(tile.id)}
              meta={`Often applied to ${tile.accepts
                .slice(0, 3)
                .map((c) => targetClassLabels[c].toLowerCase())
                .join(", ")}`}
            />
          ))}
        </TileGroup>

        <TileGroup
          label="Target"
          hint="What you'd do it to."
          count={`${targets.length} to choose from`}
        >
          {targets.map((tile) => (
            <TileRow
              key={tile.id}
              tile={tile}
              selected={state.target === tile.id}
              common={Boolean(state.pattern) && usualTargets.has(tile.id)}
              open={open === tile.id}
              onSelect={() =>
                onChange({ target: state.target === tile.id ? null : tile.id })
              }
              onToggleBrief={() => onToggleBrief(tile.id)}
              meta={`${tile.cost} · ${authorizationLabels[tile.authorization]}`}
              links={tile.links}
            >
              <p>
                <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Where to get one
                </span>
                <span className="mt-0.5 block text-foreground/90">
                  {tile.sourcing}
                </span>
              </p>
              <p>
                <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Common pitfalls
                </span>
                <span className="mt-0.5 block text-foreground/90">
                  {tile.gotchas}
                </span>
              </p>
              {tile.requires_kits.length > 0 && (
                <p>
                  <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    You'll need
                  </span>
                  <span className="mt-0.5 block text-foreground/90">
                    {tile.requires_kits
                      .map((k) => `${getKit(k).name} — ${getKit(k).cost}`)
                      .join("; ")}
                  </span>
                </p>
              )}
            </TileRow>
          ))}
        </TileGroup>

        <TileGroup
          label="Artifact"
          hint="What you'll have when you're done. Any project can end in any of these — a teardown can just as well produce a repo."
          count="Any of these, with any project"
        >
          {artifacts.map((tile) => (
            <TileRow
              key={tile.id}
              tile={tile}
              selected={state.artifact === tile.id}
              common={Boolean(state.pattern) && usualArtifacts.has(tile.id)}
              open={open === tile.id}
              onSelect={() =>
                onChange({
                  artifact: state.artifact === tile.id ? null : tile.id,
                })
              }
              onToggleBrief={() => onToggleBrief(tile.id)}
            />
          ))}
        </TileGroup>
      </div>

      {/* One of only two things in the whole tool that will actually stop you. */}
      {needsAttestation && target && (
        <label
          className={cn(
            "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2.5 text-xs leading-relaxed transition-colors",
            state.authorized
              ? "border-primary/50 bg-primary/10 text-foreground/90"
              : "border-destructive/60 bg-destructive/10 text-foreground",
          )}
        >
          <input
            type="checkbox"
            checked={state.authorized}
            onChange={(event) => onChange({ authorized: event.target.checked })}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[hsl(var(--primary))]"
          />
          <span>{authorizationAttestation[target.authorization]}</span>
        </label>
      )}

      <div className="rounded-lg border border-border bg-card/40 p-4">
        <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
          What you already have
        </h3>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Some projects need a bit of kit first. Tick anything you've already got
          and we'll stop suggesting you buy it — leave it unticked and we'll tell
          you what a project needs, and what it costs, before you start rather
          than three weeks in. None of this blocks anything.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {kits.map((kit) => {
            const owned = state.kits.includes(kit.id);

            return (
              <label
                key={kit.id}
                title={`${kit.cost} — ${kit.brief}`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors",
                  owned
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/60",
                )}
              >
                <input
                  type="checkbox"
                  checked={owned}
                  onChange={() => toggleKit(kit.id)}
                  className="h-3.5 w-3.5 accent-[hsl(var(--primary))]"
                />
                {kit.name}
              </label>
            );
          })}
        </div>
      </div>

      {pattern && (
        <div className="rounded-lg border border-border bg-card/40 p-4">
          <h3 className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
            {pattern.name} — how to actually do this
          </h3>
          <p className="mb-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            The tools and reading for this pattern specifically. Whatever target
            you point it at, these are the same.
          </p>
          <ResourceList resources={pattern.resources} />
        </div>
      )}

      {checks.length > 0 && <ChecksList checks={checks} />}
    </Panel>
  );
};

export default ProjectPane;
