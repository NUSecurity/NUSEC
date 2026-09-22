import { AlertTriangle, ShieldAlert } from "lucide-react";
import { CheckResult } from "@/bench/checks";
import { cn } from "@/lib/utils";

/**
 * The coherence checks.
 *
 * Two of the seven can block; the rest explain and let the student carry on.
 * The advisories are deliberately phrased as information rather than as
 * correction — "you'll want a UART adapter first" rather than "invalid
 * combination" — because the moment this reads as a form, students fill it out
 * resentfully.
 */
const ChecksList = ({ checks }: { checks: CheckResult[] }) => {
  if (checks.length === 0) return null;

  return (
    <ul className="space-y-2">
      {checks.map((check) => (
        <li
          key={check.id}
          className={cn(
            "flex items-start gap-2 rounded-md border px-3 py-2 text-xs leading-relaxed",
            check.severity === "block"
              ? "border-destructive/60 bg-destructive/10"
              : "border-border bg-secondary/40",
            "print:border-neutral-300 print:bg-transparent",
          )}
        >
          {check.severity === "block" ? (
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
          ) : (
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span>
            <span
              className={cn(
                "font-medium",
                check.severity === "block"
                  ? "text-destructive"
                  : "text-foreground/90",
              )}
            >
              {check.message}
            </span>
            {check.detail && (
              <span className="block text-muted-foreground">{check.detail}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ChecksList;
