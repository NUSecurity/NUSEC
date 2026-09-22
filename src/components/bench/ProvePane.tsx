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
import TileDetail, { Fact } from "@/components/bench/TileDetail";
import TileRow from "@/components/bench/TileRow";

interface ProvePaneProps {
  state: BenchState;
  open: string | null;
  onOpen: (id: string | null) => void;
  onChange: (patch: Partial<BenchState>) => void;
  onNext: () => void;
}

const tiers: (1 | 2 | 3)[] = [1, 2, 3];

/** Three tiers, three independently scrolling columns. */
const ProvePane = ({ state, open, onOpen, onChange, onNext }: ProvePaneProps) => {
  const checks = runChecks(state).filter(
    (check) => check.id === "artifact-join" || check.id === "lead-time",
  );
  const openProve = proveTiles.find((p) => p.id === open);

  const proveFacts = (p: NonNullable<typeof openProve>): Fact[] => [
    { label: "Tier", value: `${p.tier} — ${tierLabels[p.tier]}` },
    { label: "Who can say no", value: p.gatekeeper },
    { label: "Lead time", value: p.lead_time },
    { label: "Cost", value: p.cost },
    { label: `Timing`, value: `${windowTypeLabels[p.window.type]} — ${p.window.note}` },
    {
      label: "Takes",
      value:
        p.consumes_artifacts.length > 0
          ? p.consumes_artifacts.map((a) => getArtifact(a).name).join(", ")
          : "Nothing your project makes — this one stands on its own",
    },
  ];

  return (
    <Panel
      step="Step 3 of 3"
      title="Prove your skills"
      intro="Obtain and demonstrate objective proof of your skills. Anyone can say they built a thing — this is where someone else confirms it. The tiers are about who does the confirming, not about how impressive it is, and Tier 1 is where almost everyone should start."
      scrollBody={false}
      next={{
        label: "See your bench",
        onClick: onNext,
        ready: Boolean(state.prove),
      }}
    >
      <div className="flex min-h-0 flex-col gap-4 lg:h-full">
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TileGroup
              key={tier}
              label={`Tier ${tier} — ${tierLabels[tier]}`}
              hint={tierExamples[tier]}
              count={
                tier === 1
                  ? "Start here"
                  : tier === 3
                    ? "Longest lead time"
                    : undefined
              }
            >
              {proveTiles
                .filter((tile) => tile.tier === tier)
                .map((tile) => {
                  // Does this gate take what the project makes? Marked with a
                  // glow, never enforced — a cert that consumes nothing is a
                  // perfectly reasonable choice.
                  const joins =
                    state.artifact &&
                    tile.consumes_artifacts.includes(state.artifact);

                  return (
                    <TileRow
                      key={tile.id}
                      tile={tile}
                      selected={state.prove === tile.id}
                      common={Boolean(joins)}
                      onSelect={() =>
                        onChange({
                          prove: state.prove === tile.id ? null : tile.id,
                        })
                      }
                      onOpen={() => onOpen(tile.id)}
                      meta={`${tile.lead_time} · ${tile.cost}`}
                    />
                  );
                })}
            </TileGroup>
          ))}
        </div>

        {checks.length > 0 && (
          <div className="shrink-0 border-t border-border pt-3 lg:max-h-32 lg:overflow-y-auto">
            <ChecksList checks={checks} />
          </div>
        )}
      </div>

      {openProve && (
        <TileDetail
          tile={openProve}
          kind={`Tier ${openProve.tier} · ${tierLabels[openProve.tier]}`}
          facts={proveFacts(openProve)}
          links={openProve.links}
          selected={state.prove === openProve.id}
          onSelect={() => onChange({ prove: openProve.id })}
          onClose={() => onOpen(null)}
        />
      )}
    </Panel>
  );
};

export default ProvePane;
