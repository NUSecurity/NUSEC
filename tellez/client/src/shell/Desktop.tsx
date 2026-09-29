import { Icon } from "@/lib/icon";
import type { DesktopItem } from "./types";

/**
 * Desktop icons.
 *
 * Single click opens. Double click would be more faithful, but the first click
 * of a double still fires this handler, so single-click-to-open serves both
 * habits — and nobody spends the meeting stuck on an interaction detail.
 */
export function Desktop({
  items, onOpen,
}: {
  items: DesktopItem[];
  onOpen(item: DesktopItem): void;
}) {
  return (
    <div className="grid h-full grid-flow-col content-start justify-start gap-1 p-3"
         style={{ gridTemplateRows: "repeat(auto-fill, 92px)" }}>
      {items.map((item) => (
        <button
          key={`${item.label}-${item.target}`}
          onClick={() => onOpen(item)}
          className="group flex h-[92px] w-[92px] flex-col items-center justify-start gap-1.5
                     rounded-md px-1 pt-2.5 text-center transition-colors
                     hover:bg-white/10 focus:bg-white/15 focus:outline-none
                     focus:ring-1 focus:ring-husky-accent/50"
        >
          <Icon
            name={item.icon}
            size={30}
            className="shrink-0 text-husky-accent drop-shadow group-hover:text-white"
          />
          <span className="line-clamp-2 text-[11px] leading-tight text-husky-ink drop-shadow">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
