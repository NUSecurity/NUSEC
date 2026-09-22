import { Check, ExternalLink } from "lucide-react";
import { Resource, TileBase, TileLink } from "@/bench/types";
import Modal from "@/components/bench/Modal";
import ResourceList from "@/components/bench/ResourceList";
import { Button } from "@/components/ui/button";

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
}: TileDetailProps) => (
  <Modal
      kicker={kind}
      title={tile.name}
      onClose={onClose}
      actions={
        onSelect && (
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
        )
      }
    >
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
  </Modal>
  );

export default TileDetail;
