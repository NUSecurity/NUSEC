import { useEffect } from "react";
import { Check, ExternalLink, X } from "lucide-react";
import { Resource, TileBase, TileLink } from "@/bench/types";
import ResourceList from "@/components/bench/ResourceList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Fact {
  label: string;
  value: React.ReactNode;
}

interface TileDetailProps {
  tile: TileBase;
  /** "Pattern", "Target", "Gate" — what kind of thing this is. */
  kind: string;
  facts?: Fact[];
  resources?: Resource[];
  /** Heading above the resources, e.g. "Learning this skill". */
  resourcesLabel?: string;
  links?: TileLink[];
  selected?: boolean;
  onSelect?: () => void;
  onClose: () => void;
  /** Anything type-specific — the rung ladder, for instance. */
  children?: React.ReactNode;
}

const Block = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <section>
    <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {label}
    </h3>
    <div className="mt-1.5">{children}</div>
  </section>
);

/**
 * The full-screen view of one tile.
 *
 * Cards on the board carry a name and one line, because a grid of paragraphs
 * is unreadable and that was the actual complaint. Everything that used to be
 * crowded onto the card lives here instead, plus the depth there was never room
 * for: what the thing looks like in different settings, worked examples, and
 * the resources for it. Nothing was lost by shrinking the card — there is
 * considerably more here than there was anywhere before.
 */
const TileDetail = ({
  tile,
  kind,
  facts,
  resources,
  resourcesLabel = "Resources",
  links,
  selected,
  onSelect,
  onClose,
  children,
}: TileDetailProps) => {
  // Escape closes, and the page behind must not scroll while this is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-6 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={tile.name}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full max-w-4xl flex-col overflow-hidden border border-border bg-card sm:h-auto sm:max-h-[85vh] sm:rounded-xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
              {kind}
            </p>
            <h2 className="mt-0.5 text-xl font-bold leading-tight text-foreground">
              {tile.name}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {onSelect && (
              <Button
                size="sm"
                variant={selected ? "outline" : "default"}
                onClick={() => {
                  onSelect();
                  onClose();
                }}
              >
                {selected ? (
                  <>
                    <Check />
                    Chosen
                  </>
                ) : (
                  "Choose this"
                )}
              </Button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-3 leading-relaxed text-foreground/90">
            {tile.detail.overview.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>

          {facts && facts.length > 0 && (
            <dl className="grid gap-x-6 gap-y-2.5 rounded-lg border border-border bg-secondary/30 p-4 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-sm leading-snug text-foreground/90">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {children}

          {tile.detail.contexts && tile.detail.contexts.length > 0 && (
            <Block label="In different settings">
              <ul className="space-y-2.5">
                {tile.detail.contexts.map((context) => (
                  <li key={context.label} className="text-sm leading-relaxed">
                    <span className="font-semibold text-foreground">
                      {context.label}
                    </span>
                    <span className="text-muted-foreground"> — {context.body}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {tile.detail.examples && tile.detail.examples.length > 0 && (
            <Block label="What that looks like">
              <ul className="space-y-1.5">
                {tile.detail.examples.map((example) => (
                  <li
                    key={example.slice(0, 40)}
                    className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                    />
                    {example}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Block label="Where to start">
              <p className="text-sm leading-relaxed text-foreground/90">
                {tile.first_move}
              </p>
            </Block>
            <Block label="Common pitfalls">
              <p className="text-sm leading-relaxed text-foreground/90">
                {tile.failure_mode}
              </p>
            </Block>
          </div>

          {links && links.length > 0 && (
            <Block label="Go here">
              <ul className="space-y-1.5">
                {links.map((link) =>
                  link.last_verified ? (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-start gap-1.5 text-sm text-foreground hover:text-primary"
                      >
                        <ExternalLink className="mt-1 h-3 w-3 shrink-0 opacity-60" />
                        <span className="group-hover:underline">{link.title}</span>
                      </a>
                    </li>
                  ) : (
                    // Not confirmed, so named rather than linked.
                    <li
                      key={link.url}
                      className="flex items-start gap-1.5 text-sm text-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                      />
                      {link.title}
                    </li>
                  ),
                )}
              </ul>
            </Block>
          )}

          {resources && resources.length > 0 && (
            <Block label={resourcesLabel}>
              <ResourceList resources={resources} />
            </Block>
          )}
        </div>

        <footer
          className={cn(
            "shrink-0 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:px-6",
          )}
        >
          Press Escape to close.
        </footer>
      </div>
    </div>
  );
};

export default TileDetail;
