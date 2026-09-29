import type { NodeContent, NodeKind, NodeSummary } from "#shared/protocol";
import type { ReactNode } from "react";

/** What an app may ask the shell to do. */
export interface ShellApi {
  /** Point the File Explorer at a folder. Fills the explorer slot. */
  openExplorer(path: string): void;
  /** Open a file. Replaces whatever is in the app slot. */
  openPath(path: string): void;
  /** Launch an app with no file, e.g. from the Start menu. */
  openApp(appId: string): void;
  /** Hand a URL to the browser. */
  openUrl(url: string): void;
  close(slot: "explorer" | "app"): void;
}

export interface AppProps {
  node?: NodeSummary;
  content?: NodeContent;
  /**
   * What the app was launched with: a path for the File Explorer, a URL for
   * the browser. Apps that open a file get `node`/`content` instead.
   */
  arg?: string;
  shell: ShellApi;
  /** Records an in-app action. Some objectives trigger on these. */
  emit(action: string, payload?: Record<string, unknown>): void;
}

/**
 * An app is a viewer. It renders what the server sent and reports what the
 * player did. It never decides whether something is unlocked — that answer
 * only ever arrives as content or as a 403.
 */
export interface DesktopApp {
  id: string;
  title: string;
  /** Lucide icon name. */
  icon: string;
  /**
   * Which of the two windows this app occupies. Defaults to "app".
   *
   * Apps that *browse* the filesystem belong in the explorer slot, so that
   * opening a file from one leaves it on screen instead of replacing it —
   * nobody wants to reopen the recycle bin fifteen times. This is not a third
   * window; it is getting the existing two right.
   */
  slot?: "explorer" | "app";
  /** Which node kinds this app claims. Empty for apps launched on their own. */
  opens: NodeKind[];
  render(props: AppProps): ReactNode;
}
