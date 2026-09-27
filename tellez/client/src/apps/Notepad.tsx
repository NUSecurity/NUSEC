import type { AppProps, DesktopApp } from "./types";

export const notepad: DesktopApp = {
  id: "notepad",
  title: "Notepad",
  icon: "FileText",
  opens: ["text"],

  render({ content }: AppProps) {
    const body = content?.kind === "text" ? content.body : "";

    return (
      <pre className="selectable whitespace-pre-wrap break-words p-4 font-mono text-[12.5px] leading-relaxed text-husky-ink">
        {body}
      </pre>
    );
  },
};
