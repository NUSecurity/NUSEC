import { getArtifact, proveTiles } from "@/bench";
import {
  BenchState,
  Tier,
  tierExamples,
  tierLabels,
  windowTypeLabels,
} from "@/bench/types";
import FieldPane, { TileGroup } from "@/components/bench/FieldPane";
import TileRow from "@/components/bench/TileRow";

interface ProvePaneProps {
  state: BenchState;
  open: string | null;
  onToggleBrief: (id: string) => void;
  onChange: (patch: Partial<BenchState>) => void;
}

const tiers: (1 | 2 | 3)[] = [1, 2, 3];

const ProvePane = ({ state, open, onToggleBrief, onChange }: ProvePaneProps) => (
  <FieldPane
    title="Prove"
    brief="Put something in front of someone who could say no. Anyone can claim they built a thing. The question this field answers is: who else agreed?"
    resolved={Boolean(state.prove)}
  >
    {/*
      Hard block #2 of 2, enforced structurally: Tier 0 has no tiles, so there
      is nothing here that could fail it. Naming it anyway is the point — this
      is the distinction students haven't heard before, and it resolves the
      Project/Prove overlap cleanly.
    */}
    <div className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2.5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Tier 0 — {tierLabels[0 as Tier]}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {tierExamples[0 as Tier]}. <strong className="text-foreground/90">Tier 0 is not proof</strong> — it's
        the artifact your Project already produces. This field takes that
        artifact through a gate that could have rejected it, so nothing below
        Tier 1 is pickable.
      </p>
    </div>

    {tiers.map((tier) => (
      <TileGroup
        key={tier}
        label={`Tier ${tier} — ${tierLabels[tier]}`}
        hint={tierExamples[tier]}
      >
        {proveTiles
          .filter((tile) => tile.tier === tier)
          .map((tile) => {
            // Does this gate take what the project makes? Advisory only, but
            // worth showing at the point of choosing rather than after.
            const joins =
              state.artifact && tile.consumes_artifacts.includes(state.artifact);

            return (
              <TileRow
                key={tile.id}
                tile={tile}
                selected={state.prove === tile.id}
                compatible={!state.artifact || Boolean(joins)}
                open={open === tile.id}
                onSelect={() =>
                  onChange({ prove: state.prove === tile.id ? null : tile.id })
                }
                onToggleBrief={() => onToggleBrief(tile.id)}
                meta={`${tile.lead_time} · ${tile.cost}`}
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
                    Window — {windowTypeLabels[tile.window.type]}
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
  </FieldPane>
);

export default ProvePane;
