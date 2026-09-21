import { getKit, kits } from "@/bench";
import {
  availableArtifacts,
  availablePatterns,
  availableTargets,
} from "@/bench/compose";
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
import TileRow from "@/components/bench/TileRow";
import { getTarget } from "@/bench";
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
 * Patterns declare which target classes they accept, so picking a pattern
 * narrows the targets to combinations that mean something. Nothing is hidden —
 * incompatible tiles dim but stay readable and clickable, because seeing that
 * "tear down" doesn't apply to a web app is itself the lesson.
 */
const ProjectPane = ({
  state,
  open,
  onToggleBrief,
  onChange,
  onNext,
}: ProjectPaneProps) => {
  const legalPatterns = new Set(availablePatterns(state).map((p) => p.id));
  const legalTargets = new Set(availableTargets(state).map((t) => t.id));
  const legalArtifacts = new Set(availableArtifacts(state).map((a) => a.id));

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
          count={`${availablePatterns({}).length} options`}
        >
          {availablePatterns({}).map((pattern) => (
            <TileRow
              key={pattern.id}
              tile={pattern}
              selected={state.pattern === pattern.id}
              compatible={legalPatterns.has(pattern.id)}
              open={open === pattern.id}
              onSelect={() =>
                onChange({
                  pattern: state.pattern === pattern.id ? null : pattern.id,
                })
              }
              onToggleBrief={() => onToggleBrief(pattern.id)}
              meta={pattern.accepts.map((c) => targetClassLabels[c]).join(" · ")}
            />
          ))}
        </TileGroup>

        <TileGroup
          label="Target"
          hint="What you'd do it to."
          count={
            state.pattern
              ? `${legalTargets.size} fit this pattern`
              : `${availableTargets({}).length} options`
          }
        >
          {availableTargets({}).map((tile) => (
            <TileRow
              key={tile.id}
              tile={tile}
              selected={state.target === tile.id}
              compatible={legalTargets.has(tile.id)}
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
                  Watch out for
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
          hint="What you'll have when you're done."
          count={
            state.pattern
              ? `${legalArtifacts.size} fit this pattern`
              : `${availableArtifacts({}).length} options`
          }
        >
          {availableArtifacts({}).map((artifact) => (
            <TileRow
              key={artifact.id}
              tile={artifact}
              selected={state.artifact === artifact.id}
              compatible={legalArtifacts.has(artifact.id)}
              open={open === artifact.id}
              onSelect={() =>
                onChange({
                  artifact: state.artifact === artifact.id ? null : artifact.id,
                })
              }
              onToggleBrief={() => onToggleBrief(artifact.id)}
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

      {checks.length > 0 && <ChecksList checks={checks} />}
    </Panel>
  );
};

export default ProjectPane;
