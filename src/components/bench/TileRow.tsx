import { Check, Info } from "lucide-react";
import { TileBase } from "@/bench/types";
import { cn } from "@/lib/utils";

interface TileRowProps {
  tile: TileBase;
  selected: boolean;
  /**
   * A common pairing with what's already picked. Shown by tinting the card
   * purple rather than labelling it — the board is a grid of small cards and a
   * badge on every other one is noise. Purely a hint; everything stays
   * selectable, and the unusual pairings are often the interesting ones.
   */
  common?: boolean;
  onSelect: () => void;
  /** Opens the full-screen view. */
  onOpen: () => void;
  /** One short line under the name — cost, timing, what it applies to. */
  meta?: React.ReactNode;
}

/**
 * One card on the board.
 *
 * Deliberately small: a name, one line, and a way in. Everything else — the
 * brief, the first move, the pitfalls, the contexts, the examples, the
 * resources — lives in the full-screen view behind the info button, because a
 * grid of paragraphs is unreadable no matter how good the paragraphs are.
 */
const TileRow = ({
  tile,
  selected,
  common = false,
  onSelect,
  onOpen,
  meta,
}: TileRowProps) => (
  <div
    className={cn(
      "flex items-stretch rounded-md border transition-colors",
      selected
        ? // Chosen: solid border, stronger fill, and a check in the corner.
          "border-primary bg-primary/20"
        : common
          ? // Suggested: the same purple, quietly. No glow, no label.
            "border-primary/30 bg-primary/[0.07] hover:border-primary/60"
          : "border-border bg-secondary/40 hover:border-primary/60",
    )}
  >
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="min-w-0 flex-1 px-3.5 py-2.5 text-left"
    >
      <span className="flex items-start gap-2">
        {selected && (
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        )}
        <span className="min-w-0">
          <span
            className={cn(
              "block text-sm font-medium leading-snug",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            {tile.name}
          </span>
          {meta && (
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {meta}
            </span>
          )}
        </span>
      </span>
    </button>

    <button
      type="button"
      onClick={onOpen}
      aria-label={`More about ${tile.name}`}
      className="shrink-0 px-3 text-muted-foreground transition-colors hover:text-primary"
    >
      <Info className="h-4 w-4" />
    </button>
  </div>
);

export default TileRow;
