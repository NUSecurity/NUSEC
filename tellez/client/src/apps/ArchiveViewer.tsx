import { Icon } from "@/lib/icon";
import type { AppProps, DesktopApp } from "./types";

/**
 * Archives and encrypted files.
 *
 * A locked archive still lists its filenames, exactly like a real one — the
 * names are a clue, the contents are the prize.
 */
export const archive: DesktopApp = {
  id: "archive",
  title: "Archive Manager",
  icon: "FileArchive",
  opens: ["archive", "encrypted"],

  render({ content, node }: AppProps) {
    if (content?.kind === "encrypted") {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <Icon name="Lock" size={34} className="text-husky-warn" />
          <p className="text-[13px]">{node?.name} is encrypted.</p>
          {content.hint && (
            <p className="selectable max-w-sm text-[11.5px] text-husky-dim">{content.hint}</p>
          )}
        </div>
      );
    }

    if (content?.kind !== "archive") return null;

    return (
      <div className="p-3">
        {content.locked && (
          <p className="mb-3 flex items-center gap-2 rounded border border-husky-warn/40 bg-husky-warn/10 px-3 py-2 text-[11.5px] text-husky-warn">
            <Icon name="Lock" size={14} />
            Contents are password protected. The file names are readable; the files are not.
          </p>
        )}

        <ul className="divide-y divide-husky-edge">
          {content.entries.map((entry) => (
            <li key={entry.path} className="flex items-center gap-2.5 px-2 py-2 text-[12.5px]">
              <Icon name="File" size={15} className="shrink-0 text-husky-faint" />
              <span className="selectable flex-1 truncate">{entry.name}</span>
              <span className="font-mono text-[10.5px] text-husky-faint">
                {entry.meta.sizeBytes.toLocaleString()} B
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  },
};
