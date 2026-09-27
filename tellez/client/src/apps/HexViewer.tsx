import type { AppProps, DesktopApp } from "./types";

export const hex: DesktopApp = {
  id: "hex",
  title: "Hex View",
  icon: "Binary",
  opens: ["binary"],

  render({ content, node }: AppProps) {
    if (content?.kind !== "binary") return null;

    return (
      <div className="p-4">
        <p className="mb-3 text-[11.5px] text-husky-faint">
          {node?.name} is not a text file. First bytes:
        </p>
        <pre className="selectable overflow-x-auto rounded border border-husky-edge bg-black/40 p-3 font-mono text-[11.5px] leading-relaxed text-husky-dim">
          {content.hexPreview}
        </pre>
      </div>
    );
  },
};
