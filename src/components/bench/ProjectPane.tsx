import { getKit, getTarget } from "@/bench";
import {
  availableArtifacts,
  availablePatterns,
  availableTargets,
} from "@/bench/compose";
import {
  BenchState,
  authorizationAttestation,
  authorizationLabels,
  selfSatisfiable,
  targetClassLabels,
} from "@/bench/types";
import FieldPane, { TileGroup } from "@/components/bench/FieldPane";
import TileRow from "@/components/bench/TileRow";
import { cn } from "@/lib/utils";

interface ProjectPaneProps {
  state: BenchState;
  open: string | null;
  onToggleBrief: (id: string) => void;
  onChange: (patch: Partial<BenchState>) => void;
}

/**
 * Pattern × Target × Artifact.
 *
 * Patterns declare which target classes they accept, so once a pattern is
 * picked the target list narrows to combinations that mean something. Nothing
 * is hidden — incompatible tiles grey out and stay readable, because seeing
 * that "tear down" doesn't apply to a web app is the lesson.
 */
const ProjectPane = ({ state, open, onToggleBrief, onChange }: ProjectPaneProps) => {
  const legalPatterns = new Set(availablePatterns(state).map((p) => p.id));
  const legalTargets = new Set(availableTargets(state).map((t) => t.id));
  const legalArtifacts = new Set(availableArtifacts(state).map((a) => a.id));

  const target = state.target ? getTarget(state.target) : null;
  const needsAttestation =
    target && !selfSatisfiable.includes(target.authorization);

  return (
    <FieldPane
      title="Project"
      brief="Build something that didn't exist before you sat down. It has to end in an artifact — a thing with a URL that someone else can look at without you in the room."
      resolved={Boolean(state.pattern && state.target && state.artifact)}
    >
      {/*
        The position, stated where students will read it. Deliberate, not an
        oversight — a student who wants to test a university service goes
        through whatever disclosure channel the university actually has, and
        that's a different conversation from anything a tile should nudge.
      */}
      <p className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
        University systems are not on this list and won't be. If you want to test
        one, use the university's own disclosure channel — that's a different
        conversation from this tool.
      </p>

      <TileGroup label="Pattern" hint="What you do to a thing.">
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

      <TileGroup label="Target" hint="What you do it to.">
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
          >
            <p>
              <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Sourcing
              </span>
              <span className="mt-0.5 block text-foreground/90">{tile.sourcing}</span>
            </p>
            <p>
              <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Gotchas
              </span>
              <span className="mt-0.5 block text-foreground/90">{tile.gotchas}</span>
            </p>
            {tile.requires_kits.length > 0 && (
              <p>
                <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Needs
                </span>
                <span className="mt-0.5 block text-foreground/90">
                  {tile.requires_kits.map((k) => getKit(k).name).join(", ")}
                </span>
              </p>
            )}
          </TileRow>
        ))}
      </TileGroup>

      {/*
        Hard block #1 of 2. A target the student can't authorize alone doesn't
        resolve until they say they have the word of whoever can give it.
      */}
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

      <TileGroup label="Artifact" hint="What exists when you're done.">
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
    </FieldPane>
  );
};

export default ProjectPane;
