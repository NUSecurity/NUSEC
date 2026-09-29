import { Icon } from "@/lib/icon";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Window chrome.
 *
 * Fixed in a region, not free-floating: no dragging, no resizing, no z-order.
 * Several apps may be open at once, but only one is shown and the rest are
 * hidden rather than unmounted, which is what preserves their state.
 *
 * See ARCHITECTURE.md §6. Generalising this into a real window manager is
 * explicitly out of scope.
 */
export function Window({
  title, icon, subtitle, onClose, children, className, toolbar,
}: {
  title: string;
  icon: string;
  subtitle?: string;
  onClose(): void;
  children: ReactNode;
  className?: string;
  toolbar?: ReactNode;
}) {
  return (
    <section className={cn("pane flex min-h-0 flex-col animate-rise", className)}>
      <header className="flex items-center gap-2 border-b border-husky-edge px-3 py-2">
        <Icon name={icon} size={15} className="shrink-0 text-husky-accent" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[13px] font-medium leading-tight">{title}</h2>
          {subtitle && (
            <p className="truncate font-mono text-[10.5px] leading-tight text-husky-faint">
              {subtitle}
            </p>
          )}
        </div>

        {toolbar}

        <button
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="ml-1 rounded p-1 text-husky-dim transition-colors hover:bg-husky-bad/80 hover:text-white"
        >
          <Icon name="X" size={15} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}
