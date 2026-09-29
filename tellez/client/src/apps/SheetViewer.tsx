import type { AppProps, DesktopApp } from "./types";

export const sheets: DesktopApp = {
  id: "sheets",
  title: "Sheets",
  icon: "Table",
  opens: ["sheet"],

  render({ content }: AppProps) {
    if (content?.kind !== "sheet") return null;

    return (
      <div className="selectable p-3">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="w-9 border border-husky-edge bg-white/[0.04] px-2 py-1.5" />
              {content.columns.map((column) => (
                <th
                  key={column}
                  className="border border-husky-edge bg-white/[0.04] px-2.5 py-1.5 text-left font-medium"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, index) => (
              <tr key={index} className="hover:bg-white/[0.03]">
                <td className="border border-husky-edge bg-white/[0.02] px-2 py-1.5 text-center font-mono text-[10.5px] text-husky-faint">
                  {index + 1}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-husky-edge px-2.5 py-1.5 ${
                      typeof cell === "number" ? "text-right font-mono" : ""
                    }`}
                  >
                    {cell === null ? "" : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {content.note && (
          <p className="mt-3 border-t border-husky-edge pt-3 text-[11.5px] italic text-husky-dim">
            {content.note}
          </p>
        )}
      </div>
    );
  },
};
