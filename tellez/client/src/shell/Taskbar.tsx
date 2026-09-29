import { Icon } from "@/lib/icon";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

export interface TaskbarWindow {
  /** "explorer", or the id of an open app. */
  key: string;
  title: string;
  icon: string;
  /** Currently on screen. Inactive apps are open but hidden. */
  active: boolean;
}

export function Taskbar({
  windows, startOpen, onStart, onFocus, hostname,
}: {
  windows: TaskbarWindow[];
  startOpen: boolean;
  onStart(): void;
  onFocus(key: string): void;
  hostname: string;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(tick);
  }, []);

  return (
    <footer className="relative z-20 flex h-[52px] shrink-0 items-center gap-2 border-t border-husky-edge bg-husky-chrome/95 px-3 shadow-bar backdrop-blur-xl">
      <span className="hidden w-44 truncate font-mono text-[11px] text-husky-faint sm:block">
        {hostname}
      </span>

      <div className="flex flex-1 items-center justify-center gap-1.5">
        <button
          onClick={onStart}
          aria-label="Start"
          className={cn(
            "rounded-md p-2 transition-colors hover:bg-white/10",
            startOpen && "bg-white/15",
          )}
        >
          <Icon name="LayoutGrid" size={20} className="text-husky-accent" />
        </button>

        {windows.map((window) => (
          <button
            key={window.key}
            onClick={() => onFocus(window.key)}
            title={window.title}
            aria-pressed={window.active}
            className={cn(
              "flex items-center gap-2 rounded-md border-b-2 px-3 py-1.5 text-[12px] transition-colors",
              window.active
                ? "border-husky-accent bg-white/15"
                : "border-transparent bg-white/[0.04] text-husky-dim hover:bg-white/10",
            )}
          >
            <Icon
              name={window.icon}
              size={14}
              className={window.active ? "text-husky-accent" : "text-husky-faint"}
            />
            <span className="max-w-[160px] truncate">{window.title}</span>
          </button>
        ))}
      </div>

      <div className="w-44 text-right font-mono text-[11px] leading-tight text-husky-dim">
        <div>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        <div className="text-husky-faint">{now.toLocaleDateString()}</div>
      </div>
    </footer>
  );
}
