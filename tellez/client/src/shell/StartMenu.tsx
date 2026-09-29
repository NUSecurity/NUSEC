import { Icon } from "@/lib/icon";
import type { MachineInfo, StartMenuItem } from "./types";

export function StartMenu({
  items, machine, onLaunch, onClose, onSignOut,
}: {
  items: StartMenuItem[];
  machine: MachineInfo;
  onLaunch(appId: string): void;
  onClose(): void;
  /** Drops this player's session and returns them to the join screen. */
  onSignOut(): void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden />

      <div className="pane absolute bottom-[52px] left-1/2 z-40 w-[380px] -translate-x-1/2 animate-rise p-4">
        <p className="mb-3 px-1 text-[11px] uppercase tracking-wider text-husky-faint">
          Pinned
        </p>

        <div className="grid grid-cols-3 gap-1.5">
          {items.map((item) => (
            <button
              key={item.appId}
              onClick={() => {
                onLaunch(item.appId);
                onClose();
              }}
              className="flex flex-col items-center gap-2 rounded-md p-3 transition-colors hover:bg-white/10"
            >
              <Icon name={item.icon} size={24} className="text-husky-accent" />
              <span className="text-center text-[11px] leading-tight">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2.5 border-t border-husky-edge pt-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-husky-accent/15">
            <Icon name="User" size={16} className="text-husky-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium">{machine.fullName}</p>
            <p className="truncate text-[10.5px] text-husky-faint">
              {machine.user} · {machine.role}
            </p>
          </div>
          <span className="font-mono text-[10px] text-husky-faint">
            {machine.osName} {machine.osVersion}
          </span>
          <button
            onClick={onSignOut}
            title="Sign out and start over"
            aria-label="Sign out and start over"
            className="rounded-md p-1.5 text-husky-faint transition-colors hover:bg-white/10 hover:text-husky-ink"
          >
            <Icon name="Power" size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
