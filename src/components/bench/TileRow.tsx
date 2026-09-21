import { Check, ExternalLink, Info } from "lucide-react";
import { TileBase, TileLink } from "@/bench/types";
import { cn } from "@/lib/utils";

interface TileRowProps {
  tile: TileBase;
  selected: boolean;
  /**
   * A common pairing with what's already picked. Purely a hint — everything
   * stays fully selectable, and unusual combinations are often the good ones.
   */
  common?: boolean;
  /** Whether this tile's brief is currently open. */
  open: boolean;
  onSelect: () => void;
  onToggleBrief: () => void;
  /** Extra line under the name — cost, tier, authorization. */
  meta?: React.ReactNode;
  /** Somewhere concrete to go: the official page, where to get one, the spec. */
  links?: TileLink[];
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
  common = false,
  open,
  onSelect,
  onToggleBrief,
  meta,
  links,
  children,
}: TileRowProps) => (
  <div
    className={cn(
      "rounded-md border transition-colors",
      selected
        ? "border-primary bg-primary/10"
        : "border-border bg-secondary/40 hover:border-primary/60",
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
                selected ? "text-primary" : "text-foreground",
              )}
            >
              {tile.name}
              {common && !selected && (
                <span className="ml-1.5 align-middle text-[0.6rem] font-normal uppercase tracking-wider text-primary/70">
                  common
                </span>
              )}
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
          <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Common pitfalls
          </span>
          <span className="mt-0.5 block text-foreground/90">{tile.failure_mode}</span>
        </p>

        {children}

        {links && links.length > 0 && (
          <p>
            <span className="font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Go here
            </span>
            <span className="mt-1 block space-y-1">
              {links.map((link) =>
                link.last_verified ? (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-start gap-1.5 text-primary/90 hover:text-primary hover:underline"
                  >
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-70" />
                    {link.title}
                  </a>
                ) : (
                  <span
                    key={link.url}
                    className="flex items-start gap-1.5 text-foreground/80"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                    />
                    {link.title}
                  </span>
                ),
              )}
            </span>
          </p>
        )}
      </div>
    )}
  </div>
);

export default TileRow;
