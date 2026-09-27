import { Icon } from "@/lib/icon";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

export interface TaskbarWindow {
  key: "explorer" | "app";
  title: string;
  icon: string;
}

export function Taskbar({
  windows, startOpen, onStart, onFocus, hostname,
}: {
  windows: TaskbarWindow[];
  startOpen: boolean;
  onStart(): void;
  onFocus(key: "explorer" | "app"): void;
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
            className="flex items-center gap-2 rounded-md border-b-2 border-husky-accent bg-white/10 px-3 py-1.5 text-[12px] transition-colors hover:bg-white/15"
          >
            <Icon name={window.icon} size={14} className="text-husky-accent" />
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
