import { getArtifact, proveTiles } from "@/bench";
import { runChecks } from "@/bench/checks";
import {
  BenchState,
  tierExamples,
  tierLabels,
  windowTypeLabels,
} from "@/bench/types";
import ChecksList from "@/components/bench/ChecksList";
import Panel, { TileGroup } from "@/components/bench/Panel";
import TileRow from "@/components/bench/TileRow";

interface ProvePaneProps {
  state: BenchState;
  open: string | null;
  onToggleBrief: (id: string) => void;
  onChange: (patch: Partial<BenchState>) => void;
  onNext: () => void;
}

const tiers: (1 | 2 | 3)[] = [1, 2, 3];

const ProvePane = ({
  state,
  open,
  onToggleBrief,
  onChange,
  onNext,
}: ProvePaneProps) => {
  const checks = runChecks(state).filter(
    (check) => check.id === "artifact-join" || check.id === "lead-time",
  );

  return (
    <Panel
      step="Step 3 of 3"
      title="Pick something that could say no"
      intro="Anyone can say they built a thing. This step answers a different question: who else agreed? Put what you made in front of someone with the standing to turn it down."
      next={{
        label: state.prove ? "See your bench" : "See your bench",
        onClick: onNext,
        ready: Boolean(state.prove),
      }}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <TileGroup
            key={tier}
            label={`Tier ${tier} — ${tierLabels[tier]}`}
            hint={tierExamples[tier]}
            count={
              tier === 1 ? "Most reachable" : tier === 3 ? "Longest lead time" : undefined
            }
          >
            {proveTiles
              .filter((tile) => tile.tier === tier)
              .map((tile) => {
                // Does this gate take what the project makes? Marked, not
                // enforced — a cert that consumes nothing is a fine choice.
                const joins =
                  state.artifact &&
                  tile.consumes_artifacts.includes(state.artifact);

                return (
                  <TileRow
                    key={tile.id}
                    tile={tile}
                    selected={state.prove === tile.id}
                    common={Boolean(joins)}
                    open={open === tile.id}
                    onSelect={() =>
                      onChange({
                        prove: state.prove === tile.id ? null : tile.id,
                      })
                    }
                    onToggleBrief={() => onToggleBrief(tile.id)}
                    meta={`${tile.lead_time} · ${tile.cost}`}
                    links={tile.links}
                  >
                    <p>
                      <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Who can say no
                      </span>
                      <span className="mt-0.5 block text-foreground/90">
                        {tile.gatekeeper}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Timing — {windowTypeLabels[tile.window.type]}
                      </span>
                      <span className="mt-0.5 block text-foreground/90">
                        {tile.window.note}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Takes
                      </span>
                      <span className="mt-0.5 block text-foreground/90">
                        {tile.consumes_artifacts.length > 0
                          ? tile.consumes_artifacts
                              .map((id) => getArtifact(id).name)
                              .join(", ")
                          : "Nothing your project makes — this one stands on its own."}
                      </span>
                    </p>
                  </TileRow>
                );
              })}
          </TileGroup>
        ))}
      </div>

      {checks.length > 0 && <ChecksList checks={checks} />}
    </Panel>
  );
};

export default ProvePane;
