import { getArtifact, getPattern, getProve, getSkill, getTarget, presets } from "@/bench";
import { Preset, rungLabels } from "@/bench/types";

/**
 * Six worked benches, shown as their parts rather than as finished sentences.
 *
 * A preset that reads as one blob teaches copying. A preset that shows the five
 * tiles it was built from teaches the grammar — and the student's next move is
 * usually to swap one tile, which is exactly the thing worth learning.
 */
const PresetCards = ({
  onLoad,
}: {
  onLoad: (bench: Preset["bench"]) => void;
}) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {presets.map((preset) => {
      const { pattern, target, artifact, skill, from, to, prove } = preset.bench;

      // Presets are validated at dev time (see validateTiles), so every one of
      // these is fully populated.
      const parts = [
        pattern && getPattern(pattern).name,
        target && getTarget(target).name,
        artifact && getArtifact(artifact).name,
      ].filter(Boolean) as string[];

      return (
        <button
          key={preset.slug}
          type="button"
          onClick={() => onLoad(preset.bench)}
          className="flex flex-col rounded-lg border border-border bg-secondary/40 p-4 text-left transition-colors hover:border-primary/60"
        >
          <span className="text-sm font-medium text-foreground">
            {preset.title}
          </span>
          <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {preset.who}
          </span>

          <span className="mt-3 flex flex-wrap gap-1">
            {parts.map((part) => (
              <span
                key={part}
                className="rounded border border-border bg-background/60 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
              >
                {part}
              </span>
            ))}
          </span>

          <span className="mt-1.5 flex flex-wrap gap-1">
            {skill && to && (
              <span className="rounded border border-border bg-background/60 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground">
                {getSkill(skill).name} · {from ? rungLabels[from] : "new"} →{" "}
                {rungLabels[to]}
              </span>
            )}
            {prove && (
              <span className="rounded border border-primary/40 bg-primary/5 px-1.5 py-0.5 text-[0.65rem] text-primary/90">
                {getProve(prove).name}
              </span>
            )}
          </span>
        </button>
      );
    })}
  </div>
);

export default PresetCards;
