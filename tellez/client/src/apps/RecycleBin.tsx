import { api } from "@/lib/api";
import { Icon } from "@/lib/icon";
import type { DirListing } from "#shared/protocol";
import { useEffect, useState } from "react";
import type { AppProps, DesktopApp } from "./types";

const BIN = "C:/$Recycle.Bin";

const when = (at?: number) => (at ? new Date(at).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "—");

/**
 * The recycle bin gets its own view rather than reusing the File Explorer,
 * because the two columns that matter here — where a file used to live and
 * when it was thrown away — do not exist anywhere else. Deleted is not gone,
 * and the deletion record is itself evidence.
 */
function RecycleBinView({ shell }: AppProps) {
  const [listing, setListing] = useState<DirListing | null>(null);

  useEffect(() => {
    void api.list(BIN).then(setListing).catch(() => setListing(null));
  }, []);

  if (!listing) {
    return <p className="p-6 text-center text-[12px] text-husky-faint">Reading the recycle bin…</p>;
  }

  return (
    <div className="p-1">
      <table className="w-full border-collapse text-[12px]">
        <thead className="sticky top-0 bg-husky-chrome/95 backdrop-blur">
          <tr className="text-left text-[11px] uppercase tracking-wide text-husky-faint">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="hidden px-3 py-2 font-medium md:table-cell">Original location</th>
            <th className="px-3 py-2 font-medium">Date deleted</th>
          </tr>
        </thead>
        <tbody>
          {listing.entries.map((entry) => (
            <tr
              key={entry.path}
              onClick={() => shell.openPath(entry.path)}
              className="cursor-pointer border-t border-husky-edge hover:bg-white/[0.06]"
            >
              <td className="px-3 py-2">
                <span className="flex items-center gap-2">
                  <Icon name="File" size={14} className="shrink-0 text-husky-faint" />
                  <span className="truncate">{entry.name}</span>
                </span>
              </td>
              <td className="hidden max-w-0 truncate px-3 py-2 font-mono text-[10.5px] text-husky-dim md:table-cell">
                {entry.meta.deleted?.originalPath ?? "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[10.5px] text-husky-faint">
                {when(entry.meta.deleted?.at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="border-t border-husky-edge px-3 py-2.5 text-[11px] text-husky-faint">
        {listing.entries.length} items. Click one to open it.
      </p>
    </div>
  );
}

export const recycleBin: DesktopApp = {
  id: "recycle-bin",
  title: "Recycle Bin",
  icon: "Trash2",
  slot: "explorer",
  opens: [],
  render: (props) => <RecycleBinView {...props} />,
};
