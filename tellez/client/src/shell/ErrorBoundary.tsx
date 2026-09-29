import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Keeps one broken app or site renderer from taking the whole desktop down.
 *
 * This matters more than it looks: content is written by several people, a
 * viewer that throws on one unusual file would otherwise white-screen everyone
 * who opens it, and that failure would land mid-meeting. Here it costs one
 * window, the rest of the machine keeps working, and the error is on screen
 * for whoever is running the room.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode; label: string },
  { message: string | null }
> {
  state = { message: null as string | null };

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label}] crashed`, error, info.componentStack);
  }

  render() {
    if (this.state.message === null) return this.props.children;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-[13px] text-husky-warn">This window stopped responding.</p>
        <p className="selectable max-w-md font-mono text-[10.5px] text-husky-faint">
          {this.props.label}: {this.state.message}
        </p>
        <p className="text-[11px] text-husky-faint">Close it and carry on — the rest of the machine is fine.</p>
      </div>
    );
  }
}
