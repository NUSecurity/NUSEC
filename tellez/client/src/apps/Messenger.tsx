import type { AppProps, DesktopApp } from "./types";

export const messenger: DesktopApp = {
  id: "messenger",
  title: "Messages",
  icon: "MessageSquare",
  opens: ["chat"],

  render({ content }: AppProps) {
    if (content?.kind !== "chat") return null;

    return (
      <div className="selectable space-y-2.5 p-4">
        {content.messages.map((message, index) => (
          <div key={index} className="rounded-lg border border-husky-edge bg-white/[0.03] px-3 py-2">
            <p className="font-mono text-[10.5px] text-husky-faint">
              {message.channel ? `#${message.channel} · ` : ""}
              {message.author} ·{" "}
              {new Date(message.at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed">{message.body}</p>
          </div>
        ))}
      </div>
    );
  },
};
