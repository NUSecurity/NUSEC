import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PanelProps {
  step?: string;
  title: string;
  /** Plain-language explanation, always visible. This is the teaching. */
  intro: string;
  children: React.ReactNode;
  /** Label and handler for the advance button, when there's somewhere to go. */
  next?: { label: string; onClick: () => void; ready: boolean };
}

/**
 * The shell around one field.
 *
 * The intro sits at the top of every panel rather than behind a click. These
 * paragraphs are the argument for the whole tool, and a student meeting the
 * vocabulary for the first time shouldn't have to go looking for them.
 */
const Panel = ({ step, title, intro, children, next }: PanelProps) => (
  <section>
    <header className="mb-5">
      {step && (
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {step}
        </p>
      )}
      <h2 className="mt-1 text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        {intro}
      </p>
    </header>

    <div className="space-y-6">{children}</div>

    {next && (
      <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
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

/** A labeled column of tiles inside a panel. */
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
  <div>
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
        {label}
      </h3>
      {count && (
        <span className="text-[0.65rem] text-muted-foreground">{count}</span>
      )}
    </div>
    {hint && (
      <p className="mb-2.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    )}
    <div className={cn("space-y-1.5")}>{children}</div>
  </div>
);

export default Panel;
