import {
  artifacts,
  getArtifact,
  getKit,
  getTarget,
  kits,
  patterns,
  targets,
} from "@/bench";
import { runChecks } from "@/bench/checks";
import { commonArtifacts, commonPatterns, commonTargets } from "@/bench/compose";
import {
  BenchState,
  KitId,
  authorizationAttestation,
  authorizationLabels,
  effortLabels,
  selfSatisfiable,
  targetClassLabels,
} from "@/bench/types";
import ChecksList from "@/components/bench/ChecksList";
import Panel, { TileGroup } from "@/components/bench/Panel";
import TileDetail, { Fact } from "@/components/bench/TileDetail";
import TileRow from "@/components/bench/TileRow";
import { cn } from "@/lib/utils";

interface ProjectPaneProps {
  state: BenchState;
  open: string | null;
  onOpen: (id: string | null) => void;
  onChange: (patch: Partial<BenchState>) => void;
  onNext: () => void;
}

/**
 * Pattern × Target × Artifact, as three independently scrolling columns.
 *
 * Every combination is selectable. Picking a pattern makes the targets and
 * artifacts it's most often paired with glow, and that's the whole of it — the
 * unusual pairings are frequently the interesting ones and the tool has no
 * business ruling them out.
 *
 * Targets are ordered software first. Not a claim about what matters; a claim
 * about what this room turns up wanting to do.
 */
const ProjectPane = ({
  state,
  open,
  onOpen,
  onChange,
  onNext,
}: ProjectPaneProps) => {
  const usualPatterns = new Set(commonPatterns(state).map((p) => p.id));
  const usualTargets = new Set(commonTargets(state).map((t) => t.id));
  const usualArtifacts = new Set(commonArtifacts(state).map((a) => a.id));

  const checks = runChecks(state).filter(
    (check) =>
      check.id === "authorization" ||
      check.id.startsWith("kit-") ||
      check.id === "effort",
  );

  const target = state.target ? getTarget(state.target) : null;
  const needsAttestation =
    target && !selfSatisfiable.includes(target.authorization);

  const toggleKit = (id: KitId) =>
    onChange({
      kits: state.kits.includes(id)
        ? state.kits.filter((kit) => kit !== id)
        : [...state.kits, id],
    });

  const ready = Boolean(state.pattern && state.target && state.artifact);

  /* The tile whose full-screen view is open, if it's one of ours. */
  const openPattern = patterns.find((p) => p.id === open);
  const openTarget = targets.find((t) => t.id === open);
  const openArtifact = artifacts.find((a) => a.id === open);

  const targetFacts = (t: NonNullable<typeof openTarget>): Fact[] => [
    { label: "Cost", value: t.cost },
    { label: "Permission", value: authorizationLabels[t.authorization] },
    { label: "Rough size", value: effortLabels[t.effort] },
    {
      label: "Kit needed",
      value:
        t.requires_kits.length > 0
          ? t.requires_kits.map((k) => `${getKit(k).name} (${getKit(k).cost})`).join("; ")
          : "None",
    },
    { label: "Where to get one", value: t.sourcing },
    { label: "Kind of thing", value: t.classes.map((c) => targetClassLabels[c]).join(", ") },
  ];

  return (
    <Panel
      step="Step 1 of 3"
      title="Pick a project"
      intro="Something that didn't exist before you sat down, ending in a thing someone can look at without you in the room. Pick what you'd do, what you'd do it to, and what you'll have at the end. Tap the ⓘ on anything to read about it properly."
      scrollBody={false}
      next={{
        label: ready ? "Next: pick a skill" : "Skip to skill for now",
        onClick: onNext,
        ready,
      }}
    >
      <div className="flex min-h-0 flex-col gap-4 lg:h-full">
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-3">
          <TileGroup
            label="Pattern"
            hint="What you'd do."
            count={`${patterns.length}`}
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
                onSelect={() =>
                  onChange({ pattern: state.pattern === tile.id ? null : tile.id })
                }
                onOpen={() => onOpen(tile.id)}
                meta={tile.accepts
                  .slice(0, 3)
                  .map((c) => targetClassLabels[c].toLowerCase())
                  .join(", ")}
              />
            ))}
          </TileGroup>

          <TileGroup
            label="Target"
            hint="What you'd do it to. Software first; hardware further down."
            count={`${targets.length}`}
          >
            {targets.map((tile) => (
              <TileRow
                key={tile.id}
                tile={tile}
                selected={state.target === tile.id}
                common={Boolean(state.pattern) && usualTargets.has(tile.id)}
                onSelect={() =>
                  onChange({ target: state.target === tile.id ? null : tile.id })
                }
                onOpen={() => onOpen(tile.id)}
                meta={`${tile.cost} · ${authorizationLabels[tile.authorization]}`}
              />
            ))}
          </TileGroup>

          <TileGroup
            label="Artifact"
            hint="What you'll have at the end. Any project can end in any of these."
            count={`${artifacts.length}`}
          >
            {artifacts.map((tile) => (
              <TileRow
                key={tile.id}
                tile={tile}
                selected={state.artifact === tile.id}
                common={Boolean(state.pattern) && usualArtifacts.has(tile.id)}
                onSelect={() =>
                  onChange({ artifact: state.artifact === tile.id ? null : tile.id })
                }
                onOpen={() => onOpen(tile.id)}
              />
            ))}
          </TileGroup>
        </div>

        {/* Fixed strip under the board: kit, permission, and any notes. */}
        <div className="shrink-0 space-y-2 border-t border-border pt-3 lg:max-h-40 lg:overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Kit you have
            </span>
            {kits.map((kit) => {
              const owned = state.kits.includes(kit.id);

              return (
                <label
                  key={kit.id}
                  title={`${kit.cost} — ${kit.brief}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
                    owned
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/60",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={owned}
                    onChange={() => toggleKit(kit.id)}
                    className="h-3 w-3 accent-[hsl(var(--primary))]"
                  />
                  {kit.name}
                </label>
              );
            })}
          </div>

          {needsAttestation && target && (
            <label
              className={cn(
                "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 text-xs leading-relaxed transition-colors",
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

          {checks.length > 0 && <ChecksList checks={checks} />}
        </div>
      </div>

      {openPattern && (
        <TileDetail
          tile={openPattern}
          kind="Pattern"
          facts={[
            { label: "Rough size", value: effortLabels[openPattern.effort] },
            {
              label: "Usually ends in",
              value: openPattern.yields.map((a) => getArtifact(a).name).join(", "),
            },
          ]}
          resources={openPattern.resources}
          resourcesLabel="How to do this"
          selected={state.pattern === openPattern.id}
          onSelect={() => onChange({ pattern: openPattern.id })}
          onClose={() => onOpen(null)}
        />
      )}

      {openTarget && (
        <TileDetail
          tile={openTarget}
          kind="Target"
          facts={targetFacts(openTarget)}
          links={openTarget.links}
          selected={state.target === openTarget.id}
          onSelect={() => onChange({ target: openTarget.id })}
          onClose={() => onOpen(null)}
        >
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Before you start
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
              {openTarget.gotchas}
            </p>
          </div>
        </TileDetail>
      )}

      {openArtifact && (
        <TileDetail
          tile={openArtifact}
          kind="Artifact"
          selected={state.artifact === openArtifact.id}
          onSelect={() => onChange({ artifact: openArtifact.id })}
          onClose={() => onOpen(null)}
        />
      )}
    </Panel>
  );
};

export default ProjectPane;
