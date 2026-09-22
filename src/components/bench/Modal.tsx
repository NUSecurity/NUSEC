import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  /** Small uppercase label above the title. */
  kicker?: string;
  title: string;
  /** Rendered in the header, left of the close button. */
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * The shell every full-screen view shares.
 *
 * Escape closes, clicking the backdrop closes, and the page behind is locked
 * while it's open. Shared so the tile views and the example picker can't drift
 * apart — half the point of this reading as an application rather than a
 * website is that the same gesture does the same thing everywhere.
 */
const Modal = ({ kicker, title, actions, footer, onClose, children }: ModalProps) => {
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
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/80 backdrop-blur-sm sm:items-center sm:p-6 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full max-w-4xl flex-col overflow-hidden border border-border bg-card sm:h-auto sm:max-h-[85vh] sm:rounded-xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {kicker && (
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                {kicker}
              </p>
            )}
            <h2 className="mt-0.5 text-xl font-bold leading-tight text-foreground">
              {title}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {actions}
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>

        <footer className="shrink-0 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:px-6">
          {footer ?? "Press Escape to close."}
        </footer>
      </div>
    </div>
  );
};

export default Modal;
