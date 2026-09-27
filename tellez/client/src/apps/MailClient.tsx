import type { AppProps, DesktopApp } from "./types";

const when = (at: number) =>
  new Date(at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

export const mail: DesktopApp = {
  id: "mail",
  title: "Mail",
  icon: "Mail",
  opens: ["mail"],

  render({ content }: AppProps) {
    if (content?.kind !== "mail") return null;

    return (
      <div className="selectable divide-y divide-husky-edge">
        {content.messages.map((message, index) => (
          <article key={index} className="p-4">
            <h3 className="text-[13px] font-medium">{message.subject}</h3>
            <p className="mt-0.5 font-mono text-[11px] text-husky-faint">
              {message.from} → {message.to.join(", ")} · {when(message.at)}
            </p>
            <pre className="mt-2.5 whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-husky-dim">
              {message.body}
            </pre>
          </article>
        ))}
      </div>
    );
  },
};
