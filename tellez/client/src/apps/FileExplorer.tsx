import { api, ApiError } from "@/lib/api";
import { Icon } from "@/lib/icon";
import { cn } from "@/lib/cn";
import type { DirListing, NodeKind, NodeSummary } from "#shared/protocol";
import { useCallback, useEffect, useState } from "react";
import type { AppProps, DesktopApp } from "./types";

const ICONS: Record<NodeKind, string> = {
  dir: "Folder", text: "FileText", sheet: "Table", mail: "Mail", chat: "MessageSquare",
  image: "Image", video: "Film", archive: "FileArchive", encrypted: "Lock",
  shortcut: "ExternalLink", binary: "Binary",
};

const bytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1_048_576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1_048_576).toFixed(1)} MB`;

export function FileExplorerView({ arg, shell }: AppProps) {
  const path = arg ?? "C:";
  const [listing, setListing] = useState<DirListing | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setListing(await api.list(path, showHidden));
    } catch (cause) {
      setListing(null);
      // In-world wording. A player should never see a stack trace, and should
      // not be able to tell a locked folder from one that isn't there.
      setError(
        cause instanceof ApiError && cause.status === 403
          ? "Access is denied."
          : "This location is not available.",
      );
    }
  }, [path, showHidden]);

  useEffect(() => {
    void load();
  }, [load]);

  function open(entry: NodeSummary) {
    if (entry.kind === "dir") shell.openExplorer(entry.path);
    else shell.openPath(entry.path);
  }

  const crumbs = path.split("/");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-husky-edge px-2 py-1.5">
        <button
          onClick={() => listing?.parent && shell.openExplorer(listing.parent)}
          disabled={!listing?.parent}
          className="btn px-2 py-1"
          aria-label="Up one level"
        >
          <Icon name="ArrowUp" size={14} />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden rounded-md border border-husky-edge bg-black/25 px-2 py-1">
          {crumbs.map((crumb, index) => (
            <span key={index} className="flex min-w-0 items-center">
              {index > 0 && <Icon name="ChevronRight" size={12} className="mx-0.5 shrink-0 text-husky-faint" />}
              <button
                onClick={() => shell.openExplorer(crumbs.slice(0, index + 1).join("/"))}
                className="truncate rounded px-1 py-0.5 font-mono text-[11.5px] hover:bg-white/10"
              >
                {crumb}
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowHidden((value) => !value)}
          className={cn("btn px-2 py-1", showHidden && "bg-husky-accent/20 border-husky-accent/50")}
          title="Show hidden items"
          aria-pressed={showHidden}
        >
          <Icon name={showHidden ? "Eye" : "EyeOff"} size={14} />
        </button>
      </div>

      {error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <Icon name="ShieldAlert" size={26} className="text-husky-warn" />
          <p className="text-[12.5px] text-husky-dim">{error}</p>
        </div>
      )}

      {listing && (
        <ul className="flex-1 overflow-auto p-1">
          {listing.entries.length === 0 && (
            <li className="p-6 text-center text-[12px] text-husky-faint">This folder is empty.</li>
          )}

          {listing.entries.map((entry) => (
            <li key={entry.path}>
              <button
                onClick={() => open(entry)}
                className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-left transition-colors hover:bg-white/[0.07]"
              >
                <Icon
                  name={ICONS[entry.kind]}
                  size={15}
                  className={cn("shrink-0", entry.kind === "dir" ? "text-husky-accent" : "text-husky-faint")}
                />
                <span className={cn("flex-1 truncate text-[12.5px]", entry.meta.attributes.includes("hidden") && "opacity-55")}>
                  {entry.name}
                </span>
                <span className="hidden shrink-0 font-mono text-[10.5px] text-husky-faint sm:block">
                  {new Date(entry.meta.modifiedAt).toLocaleDateString()}
                </span>
                {entry.kind !== "dir" && (
                  <span className="w-16 shrink-0 text-right font-mono text-[10.5px] text-husky-faint">
                    {bytes(entry.meta.sizeBytes)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const explorer: DesktopApp = {
  id: "explorer",
  title: "File Explorer",
  icon: "FolderOpen",
  slot: "explorer",
  opens: [],
  render: (props) => <FileExplorerView {...props} />,
};
