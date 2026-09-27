import { appById } from "@/apps/registry";
import type { ShellApi } from "@/apps/types";
import { api, ApiError } from "@/lib/api";
import { emit } from "@/lib/telemetry";
import { Desktop } from "@/shell/Desktop";
import { ErrorBoundary } from "@/shell/ErrorBoundary";
import { LockScreen } from "@/shell/LockScreen";
import { StartMenu } from "@/shell/StartMenu";
import { Taskbar, type TaskbarWindow } from "@/shell/Taskbar";
import { Toasts } from "@/shell/Toasts";
import type { DesktopItem, DesktopPayload } from "@/shell/types";
import { Window } from "@/shell/Window";
import type { NodeContent, NodeSummary } from "#shared/protocol";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Slot {
  appId: string;
  arg?: string;
  node?: NodeSummary;
  content?: NodeContent;
}

/**
 * The desktop.
 *
 * Holds the two window slots and nothing else — see ARCHITECTURE.md §6. There
 * is no z-order, no dragging and no third window, and that constraint is the
 * single biggest reason this was affordable to build.
 */
export function Play() {
  const navigate = useNavigate();
  const [desktop, setDesktop] = useState<DesktopPayload | null>(null);
  const [locked, setLocked] = useState<boolean | null>(null);
  const [explorerSlot, setExplorerSlot] = useState<Slot | null>(null);
  const [appSlot, setAppSlot] = useState<Slot | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; title: string }[]>([]);

  /* --------------------------------------------------------- bootstrap */

  const loadDesktop = useCallback(async () => {
    try {
      setDesktop(await api.me().then(() => fetchDesktop()));
      setLocked(false);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) return navigate("/join", { replace: true });
      setLocked(true);
    }
  }, [navigate]);

  useEffect(() => {
    void loadDesktop();
  }, [loadDesktop]);

  /* ------------------------------------------------------------ toasts */

  const announce = useCallback(
    (revealed: string[]) => {
      if (revealed.length === 0 || !desktop) return;

      const fresh = revealed
        .map((id) => desktop.catalogue.find((entry) => entry.id === id))
        .filter((entry): entry is { id: string; title: string } => entry !== undefined);

      if (fresh.length === 0) return;

      setToasts((current) => [...current, ...fresh]);
      setTimeout(
        () => setToasts((current) => current.filter((toast) => !fresh.some((item) => item.id === toast.id))),
        4500,
      );
    },
    [desktop],
  );

  /* ------------------------------------------------------------- shell */

  const shell = useMemo<ShellApi>(
    () => ({
      openExplorer(path) {
        setExplorerSlot({ appId: "explorer", arg: path });
      },

      async openPath(path) {
        try {
          const result = await api.read(path);
          setAppSlot({ appId: result.opensWith, node: result.summary, content: result.content });
          announce(result.revealed);
        } catch (cause) {
          // Directories belong in the explorer slot, not the app slot.
          if (cause instanceof ApiError && cause.status === 400) {
            return setExplorerSlot({ appId: "explorer", arg: path });
          }
          if (cause instanceof ApiError && cause.status === 403) {
            return setAppSlot({ appId: "denied", arg: path });
          }
          setAppSlot({ appId: "missing", arg: path });
        }
      },

      openApp(appId) {
        emit("app.launch", { app: appId });

        if (appById(appId)?.slot === "explorer") {
          const arg = appId === "explorer" ? (explorerSlot?.arg ?? "C:") : undefined;
          return setExplorerSlot({ appId, arg });
        }

        setAppSlot({ appId });
      },

      openUrl(url) {
        emit("app.launch", { app: "browser" });
        setAppSlot({ appId: "browser", arg: url });
      },

      close(slot) {
        if (slot === "explorer") setExplorerSlot(null);
        else setAppSlot(null);
      },
    }),
    [announce, explorerSlot],
  );

  function openDesktopItem(item: DesktopItem) {
    if (item.target.startsWith("app:")) return shell.openApp(item.target.slice(4));
    if (item.target.startsWith("url:")) return shell.openUrl(item.target.slice(4));
    void shell.openPath(item.target);
  }

  /* ------------------------------------------------------------ render */

  if (locked === null) {
    return <div className="wallpaper flex h-full items-center justify-center text-husky-faint">Loading…</div>;
  }

  if (locked) return <LockScreen onUnlocked={() => void loadDesktop()} />;
  if (!desktop) return null;

  const app = appSlot ? appById(appSlot.appId) : undefined;
  const browser = explorerSlot ? appById(explorerSlot.appId) : undefined;

  const browserTitle = explorerSlot?.arg
    ? explorerSlot.arg.split("/").pop() || explorerSlot.arg
    : browser?.title ?? "Explorer";

  const windows: TaskbarWindow[] = [
    ...(explorerSlot ? [{ key: "explorer" as const, title: browserTitle, icon: browser?.icon ?? "FolderOpen" }] : []),
    ...(appSlot ? [{ key: "app" as const, title: appSlot.node?.name ?? app?.title ?? "Window", icon: app?.icon ?? "AppWindow" }] : []),
  ];

  const both = Boolean(explorerSlot) && Boolean(appSlot);

  return (
    <div className="wallpaper flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Desktop items={desktop.desktopItems} onOpen={openDesktopItem} />

        <div className="pointer-events-none absolute inset-0 flex gap-3 p-3">
          {explorerSlot && browser && (
            <Window
              title={browser.title}
              subtitle={explorerSlot.arg}
              icon={browser.icon}
              onClose={() => shell.close("explorer")}
              className={both ? "pointer-events-auto w-[44%]" : "pointer-events-auto mx-auto w-full max-w-3xl"}
            >
              <ErrorBoundary label={explorerSlot.appId}>
                {browser.render({
                  arg: explorerSlot.arg,
                  shell,
                  emit: (action, payload) =>
                    emit("app.action", { app: explorerSlot.appId, action, ...payload }),
                })}
              </ErrorBoundary>
            </Window>
          )}

          {appSlot && (
            <Window
              title={appSlot.node?.name ?? app?.title ?? "Window"}
              subtitle={appSlot.node?.path}
              icon={app?.icon ?? "AppWindow"}
              onClose={() => shell.close("app")}
              className={both ? "pointer-events-auto flex-1" : "pointer-events-auto mx-auto w-full max-w-3xl"}
            >
              <ErrorBoundary label={appSlot.appId}>
                {app
                  ? app.render({
                      node: appSlot.node,
                      content: appSlot.content,
                      arg: appSlot.arg,
                      shell,
                      emit: (action, payload) => emit("app.action", { app: appSlot.appId, action, ...payload }),
                    })
                  : <Refusal kind={appSlot.appId} path={appSlot.arg} />}
              </ErrorBoundary>
            </Window>
          )}
        </div>

        <Toasts messages={toasts} />

        {startOpen && (
          <StartMenu
            items={desktop.startMenuItems}
            machine={desktop.machine}
            onLaunch={(appId) => shell.openApp(appId)}
            onClose={() => setStartOpen(false)}
          />
        )}
      </div>

      <Taskbar
        windows={windows}
        startOpen={startOpen}
        hostname={`${desktop.machine.hostname} · ${desktop.machine.user}`}
        onStart={() => setStartOpen((open) => !open)}
        onFocus={() => setStartOpen(false)}
      />
    </div>
  );
}

/** In-world refusals. A locked file must not look different from a missing one. */
function Refusal({ kind, path }: { kind: string; path?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-[13px]">
        {kind === "denied" ? "Access is denied." : "This file is no longer in this location."}
      </p>
      {path && <p className="font-mono text-[11px] text-husky-faint">{path}</p>}
    </div>
  );
}

async function fetchDesktop(): Promise<DesktopPayload> {
  const response = await fetch("/api/desktop");
  if (!response.ok) throw new ApiError(response.status, "locked");
  return response.json() as Promise<DesktopPayload>;
}
