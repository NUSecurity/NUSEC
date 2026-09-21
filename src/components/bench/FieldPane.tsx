import { cn } from "@/lib/utils";

interface FieldPaneProps {
  /** Project / Skill / Prove. */
  title: string;
  /** The brief shown at the top of the pane, always visible. */
  brief: string;
  /** Renders as resolved once the field's tiles are all picked. */
  resolved: boolean;
  children: React.ReactNode;
}

/**
 * One of the three panes. Each field's brief sits at the top of its own pane
 * rather than behind a click, because these three paragraphs are the argument
 * for the whole tool and a student shouldn't have to go looking for them.
 */
const FieldPane = ({ title, brief, resolved, children }: FieldPaneProps) => (
  <section
    className={cn(
      "flex flex-col rounded-lg border bg-card/40 p-4 transition-colors",
      resolved ? "border-primary/40" : "border-border",
    )}
  >
    <header className="mb-3">
      <h2
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          resolved ? "text-primary" : "text-muted-foreground",
        )}
      >
        {title}
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{brief}</p>
    </header>

    <div className="space-y-4">{children}</div>
  </section>
);

/** A labeled group of tiles inside a pane — Pattern, Target, Artifact. */
export const TileGroup = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-foreground/70">
      {label}
    </h3>
    {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
    <div className="space-y-1.5">{children}</div>
  </div>
);

export default FieldPane;
