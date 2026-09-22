import { ArrowRight } from "lucide-react";
import {
  getArtifact,
  getPattern,
  getProve,
  getSkill,
  getTarget,
  presets,
} from "@/bench";
import { Preset, rungLabels } from "@/bench/types";
import Modal from "@/components/bench/Modal";

const Chip = ({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <span
    className={
      accent
        ? "rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[0.65rem] text-primary"
        : "rounded border border-border bg-background/60 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
    }
  >
    {children}
  </span>
);

/**
 * The example picker.
 *
 * Each one is shown as the tiles it was built from rather than as a finished
 * blob, because a preset that reads as one thing teaches copying and a preset
 * you can see the parts of teaches the grammar. Loading one fills all three
 * fields; the student's next move is usually to swap a single tile, which is
 * the whole lesson.
 */
const PresetPicker = ({
  onLoad,
  onClose,
}: {
  onLoad: (bench: Preset["bench"]) => void;
  onClose: () => void;
}) => (
  <Modal
    kicker="Six worked benches"
    title="Start from an example"
    onClose={onClose}
    footer="These are made to be taken apart, not copied. Load one, then change whatever doesn't suit you."
  >
    <div className="grid gap-3 sm:grid-cols-2">
      {presets.map((preset) => {
        const { pattern, target, artifact, skill, from, to, prove } = preset.bench;

        return (
          <button
            key={preset.slug}
            type="button"
            onClick={() => {
              onLoad(preset.bench);
              onClose();
            }}
            className="group flex flex-col rounded-lg border border-border bg-secondary/30 p-4 text-left transition-colors hover:border-primary/60 hover:bg-secondary/50"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-foreground">
                {preset.title}
              </span>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </span>

            <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {preset.who}
            </span>

            <span className="mt-3 flex flex-wrap gap-1">
              {pattern && <Chip>{getPattern(pattern).name}</Chip>}
              {target && <Chip>{getTarget(target).name}</Chip>}
              {artifact && <Chip>{getArtifact(artifact).name}</Chip>}
            </span>

            <span className="mt-1.5 flex flex-wrap gap-1">
              {skill && to && (
                <Chip>
                  {getSkill(skill).name} · {from ? rungLabels[from] : "new"} →{" "}
                  {rungLabels[to]}
                </Chip>
              )}
              {prove && <Chip accent>{getProve(prove).name}</Chip>}
            </span>
          </button>
        );
      })}
    </div>
  </Modal>
);

export default PresetPicker;
