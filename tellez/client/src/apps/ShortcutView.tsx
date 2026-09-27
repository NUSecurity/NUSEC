import { Icon } from "@/lib/icon";
import type { AppProps, DesktopApp } from "./types";

export const shortcut: DesktopApp = {
  id: "shortcut",
  title: "Shortcut",
  icon: "ExternalLink",
  opens: ["shortcut"],

  render({ content, shell }: AppProps) {
    if (content?.kind !== "shortcut") return null;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <Icon name="ExternalLink" size={30} className="text-husky-accent" />
        <p className="text-[12px] text-husky-dim">This shortcut points to</p>
        <code className="selectable rounded border border-husky-edge bg-black/30 px-3 py-1.5 font-mono text-[12.5px]">
          {content.target}
        </code>
        <button
          className="btn btn-primary"
          onClick={() =>
            content.targetKind === "url"
              ? shell.openUrl(content.target)
              : shell.openExplorer(content.target)
          }
        >
          Follow
        </button>
      </div>
    );
  },
};
