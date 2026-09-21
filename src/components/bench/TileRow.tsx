import { Check, Info } from "lucide-react";
import { TileBase } from "@/bench/types";
import { cn } from "@/lib/utils";

interface TileRowProps {
  tile: TileBase;
  selected: boolean;
  /**
   * Compatible with what's picked elsewhere. Incompatible tiles stay clickable
   * and legible — greying and explaining teaches; hiding and blocking doesn't.
   */
  compatible?: boolean;
  /** Whether this tile's brief is currently open. */
  open: boolean;
  onSelect: () => void;
  onToggleBrief: () => void;
  /** Extra line under the name — cost, tier, authorization. */
  meta?: React.ReactNode;
  /** Rendered inside the open brief, under first move and failure mode. */
  children?: React.ReactNode;
}

/**
 * One selectable tile.
 *
 * Clicking the body picks it; clicking the info button reads the brief without
 * committing to anything. Both first_move and failure_mode are always shown in
 * the brief, because those two fields are the ones that do the work — student
 * plans die because step one was never concrete and because the common failure
 * was never named.
 */
const TileRow = ({
  tile,
  selected,
  compatible = true,
  open,
  onSelect,
  onToggleBrief,
  meta,
  children,
}: TileRowProps) => (
  <div
    className={cn(
      "rounded-md border transition-colors",
      selected
        ? "border-primary bg-primary/10"
        : compatible
          ? "border-border bg-secondary/40 hover:border-primary/60"
          : "border-border/50 bg-secondary/20",
    )}
  >
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="min-w-0 flex-1 px-3 py-2 text-left"
      >
        <span className="flex items-start gap-2">
          {selected && (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          )}
          <span className="min-w-0">
            <span
              className={cn(
                "block text-sm font-medium leading-snug",
                selected
                  ? "text-primary"
                  : compatible
                    ? "text-foreground"
                    : "text-muted-foreground",
              )}
            >
              {tile.name}
            </span>
            {meta && (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {meta}
              </span>
            )}
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleBrief}
        aria-expanded={open}
        aria-label={open ? `Hide details for ${tile.name}` : `About ${tile.name}`}
        className={cn(
          "shrink-0 px-2.5 transition-colors",
          open ? "text-primary" : "text-muted-foreground hover:text-primary",
        )}
      >
        <Info className="h-4 w-4" />
      </button>
    </div>

    {open && (
      <div className="space-y-2.5 border-t border-border/60 px-3 py-2.5 text-xs leading-relaxed">
        <p className="text-muted-foreground">{tile.brief}</p>

        <p>
          <span className="font-semibold uppercase tracking-[0.15em] text-primary/80">
            First move
          </span>
          <span className="mt-0.5 block text-foreground/90">{tile.first_move}</span>
        </p>

        <p>
          <span className="font-semibold uppercase tracking-[0.15em] text-destructive/80">
            How people lose
          </span>
          <span className="mt-0.5 block text-foreground/90">{tile.failure_mode}</span>
        </p>

        {children}
      </div>
    )}
  </div>
);

export default TileRow;
