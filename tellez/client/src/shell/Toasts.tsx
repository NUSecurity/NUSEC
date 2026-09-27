import { Icon } from "@/lib/icon";

/**
 * Acknowledges a discovery by name, after the fact.
 *
 * Titles only, and only for objectives the player has already reached — there
 * is no checklist and no score. Hidden objectives never appear here at all,
 * which is why the catalogue the client holds excludes them server-side.
 */
export function Toasts({ messages }: { messages: { id: string; title: string }[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="pointer-events-none absolute bottom-[68px] right-4 z-50 flex flex-col gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className="pane flex animate-toast items-center gap-2.5 px-3.5 py-2.5 text-[12px]"
        >
          <Icon name="CircleCheck" size={16} className="shrink-0 text-husky-good" />
          <span>{message.title}</span>
        </div>
      ))}
    </div>
  );
}
