import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PanelProps {
  step?: string;
  title: string;
  /** Plain-language explanation, always visible. This is the teaching. */
  intro: string;
  /**
   * When true the panel body scrolls as one block. Leave false for panels
   * whose children scroll independently — the three-column boards do their own.
   */
  scrollBody?: boolean;
  children: React.ReactNode;
  next?: { label: string; onClick: () => void; ready: boolean };
}

/**
 * The shell around one field, sized to the viewport.
 *
 * The header and the footer stay put; only the body moves. Scrolling the whole
 * page to reach a control is what made this feel like a document rather than a
 * tool, so nothing outside the body scrolls at all on a large screen.
 */
const Panel = ({
  step,
  title,
  intro,
  scrollBody = true,
  children,
  next,
}: PanelProps) => (
  <section className="flex min-h-0 flex-col lg:h-full">
    <header className="shrink-0 pb-4">
      {step && (
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {step}
        </p>
      )}
      <h2 className="mt-0.5 text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {intro}
      </p>
    </header>

    <div
      className={
        scrollBody
          ? "min-h-0 flex-1 space-y-5 lg:overflow-y-auto lg:pr-2"
          : "min-h-0 flex-1"
      }
    >
      {children}
    </div>

    {next && (
      <div className="mt-4 flex shrink-0 items-center gap-3 border-t border-border pt-4">
        <Button onClick={next.onClick} variant={next.ready ? "default" : "outline"}>
          {next.label}
          <ArrowRight />
        </Button>
        {!next.ready && (
          <span className="text-xs text-muted-foreground">
            You can come back to this — nothing is locked in.
          </span>
        )}
      </div>
    )}
  </section>
);

/**
 * A column of cards that scrolls on its own.
 *
 * Each column keeps its own scroll position, so picking a target doesn't move
 * the pattern list you were reading.
 */
export const TileGroup = ({
  label,
  hint,
  count,
  children,
}: {
  label: string;
  hint?: string;
  count?: string;
  children: React.ReactNode;
}) => (
  <div className="flex min-h-0 flex-col">
    <div className="shrink-0">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
          {label}
        </h3>
        {count && (
          <span className="shrink-0 text-[0.65rem] text-muted-foreground">
            {count}
          </span>
        )}
      </div>
      {hint && (
        <p className="mb-2 mt-1 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
    </div>

    {/* Each column keeps its own scroll on a large screen; on a phone the
        page scrolls normally, because a locked viewport there fights the
        browser chrome and loses. */}
    <div className="min-h-0 flex-1 space-y-2.5 pb-2 lg:overflow-y-auto lg:pr-2">
      {children}
    </div>
  </div>
);

export default Panel;
