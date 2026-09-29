import { appById } from "@/apps/registry";
import type { ShellApi } from "@/apps/types";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { emit } from "@/lib/telemetry";
import { Desktop } from "@/shell/Desktop";
import { ErrorBoundary } from "@/shell/ErrorBoundary";
import { LockScreen } from "@/shell/LockScreen";
import { StartMenu } from "@/shell/StartMenu";
import { Taskbar, type TaskbarWindow } from "@/shell/Taskbar";
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

/** Replaces the entry for an app id in place, or appends it. */
function upsert(slots: Slot[], slot: Slot): Slot[] {
  const index = slots.findIndex((existing) => existing.appId === slot.appId);
  if (index === -1) return [...slots, slot];

  const next = [...slots];
  next[index] = slot;
  return next;
}

/**
 * The desktop.
 *
 * Two regions, not a window manager: the File Explorer on the left, and one
 * visible application on the right. See ARCHITECTURE.md §6.
 *
 * Several applications may be *open* at once even though only one is *shown* —
 * they appear in the taskbar and clicking one brings it forward. Crucially the
 * inactive ones stay mounted and are hidden with CSS rather than unmounted,
 * because that is the only thing that preserves their internal state: the
 * browser remembers the page it was on, and a note remembers the file it was
 * showing. Unmounting them would throw that away, which is exactly the problem
 * this solves — reading the portal note, opening the browser, and coming back
 * to find the note gone.
 *
 * One instance per application, so opening a second text file replaces the
 * contents of the text viewer rather than stacking another copy of it.
 */
export function Play() {
  const navigate = useNavigate();
  const [desktop, setDesktop] = useState<DesktopPayload | null>(null);
  const [locked, setLocked] = useState<boolean | null>(null);
  const [explorerSlot, setExplorerSlot] = useState<Slot | null>(null);
  const [apps, setApps] = useState<Slot[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);

  /* --------------------------------------------------------- bootstrap */

  // A refresh deliberately keeps progress — a crashed tab mid-meeting must not
  // cost anyone their place — so starting over is its own action, and it asks.
  const signOut = useCallback(async () => {
    if (!window.confirm("Sign out and start over? Everything you have found on this machine will be lost.")) return;
    await api.signOut().catch(() => undefined);
    navigate("/join", { replace: true });
  }, [navigate]);

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

  /* ------------------------------------------------------------- shell */

  const show = useCallback((slot: Slot) => {
    setApps((current) => upsert(current, slot));
    setActiveApp(slot.appId);
  }, []);

  const shell = useMemo<ShellApi>(
    () => ({
      openExplorer(path) {
        setExplorerSlot({ appId: "explorer", arg: path });
      },

      async openPath(path) {
        try {
          const result = await api.read(path);
          show({ appId: result.opensWith, node: result.summary, content: result.content });
        } catch (cause) {
          // Directories belong in the explorer region, not the app region.
          if (cause instanceof ApiError && cause.status === 400) {
            return setExplorerSlot({ appId: "explorer", arg: path });
          }
          // Refusals share one id so repeated denials replace each other
          // instead of collecting taskbar buttons.
          const kind = cause instanceof ApiError && cause.status === 403 ? "denied" : "missing";
          show({ appId: "notice", arg: path, content: { kind: "text", body: kind } });
        }
      },

      openApp(appId) {
        emit("app.launch", { app: appId });

        if (appById(appId)?.slot === "explorer") {
          const arg = appId === "explorer" ? (explorerSlot?.arg ?? "C:") : undefined;
          return setExplorerSlot({ appId, arg });
        }

        // Already open: bring it forward untouched. Re-launching the browser
        // must not reset the page it was on.
        setApps((current) =>
          current.some((slot) => slot.appId === appId) ? current : [...current, { appId }],
        );
        setActiveApp(appId);
      },

      openUrl(url) {
        emit("app.launch", { app: "browser" });
        show({ appId: "browser", arg: url });
      },

      close(slot) {
        if (slot === "explorer") return setExplorerSlot(null);

        setApps((current) => {
          const next = current.filter((open) => open.appId !== activeApp);
          setActiveApp(next.length > 0 ? next[next.length - 1].appId : null);
          return next;
        });
      },
    }),
    [activeApp, explorerSlot, show],
  );

  /** Closes one app by id, from its taskbar button or its own close control. */
  const closeApp = useCallback((appId: string) => {
    setApps((current) => {
      const next = current.filter((slot) => slot.appId !== appId);
      setActiveApp((active) =>
        active === appId ? (next.length > 0 ? next[next.length - 1].appId : null) : active,
      );
      return next;
    });
  }, []);

  function openDesktopItem(item: DesktopItem) {
    if (item.target.startsWith("app:")) return shell.openApp(item.target.slice(4));
    if (item.target.startsWith("url:")) return shell.openUrl(item.target.slice(4));
    void shell.openPath(item.target);
  }

  /* ------------------------------------------------------------ render */

  if (locked === null) {
    return <div className="wallpaper flex h-full items-center justify-center text-husky-faint">Loading…</div>;
  }

  if (locked) return <LockScreen onUnlocked={() => void loadDesktop()} onSignOut={() => void signOut()} />;
  if (!desktop) return null;

  const explorerApp = explorerSlot ? appById(explorerSlot.appId) : undefined;
  const explorerTitle = explorerApp?.title ?? "Explorer";

  const titleOf = (slot: Slot) =>
    slot.node?.name ?? appById(slot.appId)?.title ?? "Notice";

  const windows: TaskbarWindow[] = [
    ...(explorerSlot && explorerApp
      ? [{
          key: "explorer",
          title: explorerTitle,
          icon: explorerApp.icon,
          active: true,
        }]
      : []),
    ...apps.map((slot) => ({
      key: slot.appId,
      title: titleOf(slot),
      icon: appById(slot.appId)?.icon ?? "TriangleAlert",
      active: slot.appId === activeApp,
    })),
  ];

  const both = Boolean(explorerSlot) && activeApp !== null;
  const wide = "mx-auto w-full max-w-3xl";

  return (
    <div className="wallpaper flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Desktop items={desktop.desktopItems} onOpen={openDesktopItem} />

        <div className="pointer-events-none absolute inset-0 flex gap-3 p-3">
          {explorerSlot && explorerApp && (
            <Window
              title={explorerApp.title}
              subtitle={explorerSlot.arg}
              icon={explorerApp.icon}
              onClose={() => shell.close("explorer")}
              className={cn("pointer-events-auto", both ? "w-[44%]" : wide)}
            >
              <ErrorBoundary label={explorerSlot.appId}>
                {explorerApp.render({
                  arg: explorerSlot.arg,
                  shell,
                  emit: (action, payload) =>
                    emit("app.action", { app: explorerSlot.appId, action, ...payload }),
                })}
              </ErrorBoundary>
            </Window>
          )}

          {apps.map((slot) => {
            const app = appById(slot.appId);
            const active = slot.appId === activeApp;

            return (
              <Window
                key={slot.appId}
                title={titleOf(slot)}
                subtitle={slot.node?.path ?? slot.arg}
                icon={app?.icon ?? "TriangleAlert"}
                onClose={() => closeApp(slot.appId)}
                // Hidden, not unmounted. See the note at the top of this file.
                className={cn("pointer-events-auto", both ? "flex-1" : wide, !active && "hidden")}
              >
                <ErrorBoundary label={slot.appId}>
                  {app
                    ? app.render({
                        node: slot.node,
                        content: slot.content,
                        arg: slot.arg,
                        shell,
                        emit: (action, payload) =>
                          emit("app.action", { app: slot.appId, action, ...payload }),
                      })
                    : <Refusal
                        kind={slot.content?.kind === "text" ? slot.content.body : "missing"}
                        path={slot.arg}
                      />}
                </ErrorBoundary>
              </Window>
            );
          })}
        </div>

        {startOpen && (
          <StartMenu
            items={desktop.startMenuItems}
            machine={desktop.machine}
            onLaunch={(appId) => shell.openApp(appId)}
            onClose={() => setStartOpen(false)}
            onSignOut={() => {
              setStartOpen(false);
              void signOut();
            }}
          />
        )}
      </div>

      <Taskbar
        windows={windows}
        startOpen={startOpen}
        hostname={`${desktop.machine.hostname} · ${desktop.machine.user}`}
        onStart={() => setStartOpen((open) => !open)}
        onFocus={(key) => {
          setStartOpen(false);
          if (key !== "explorer") setActiveApp(key);
        }}
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
