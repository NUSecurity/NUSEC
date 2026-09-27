import { api } from "@/lib/api";
import { Icon } from "@/lib/icon";
import { cn } from "@/lib/cn";
import type { BoardView } from "#shared/protocol";
import { useEffect, useState, type FormEvent } from "react";

const POLL_MS = 2000;

/**
 * The facilitator board. Unlisted, password-gated, never linked from the game.
 *
 * The number that matters is not who finished. It is the per-objective count:
 * that is what tells you the whole room is stuck on one thing, while there is
 * still time to release a hint.
 */
export function Board() {
  const [key, setKey] = useState(() => new URLSearchParams(location.search).get("key") ?? "");
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<(BoardView & { storage: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;

    let live = true;

    const poll = async () => {
      try {
        const next = await api.board(key);
        if (!live) return;
        setView(next);
        setAuthed(true);
        setError(null);
      } catch (cause) {
        if (!live) return;
        setError(cause instanceof Error ? cause.message : "unreachable");
        setAuthed(false);
      }
    };

    void poll();
    const timer = setInterval(poll, POLL_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [key]);

  if (!authed || !view) {
    return (
      <div className="wallpaper flex h-full items-center justify-center p-6">
        <form
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            setKey((document.getElementById("key") as HTMLInputElement).value);
          }}
          className="pane w-full max-w-sm p-6"
        >
          <h1 className="text-[15px] font-semibold">Facilitator board</h1>
          <p className="mb-4 mt-1 text-[12px] text-husky-dim">FACILITATOR_PASSWORD.</p>
          <input id="key" type="password" defaultValue={key} className="field" autoFocus />
          <button type="submit" className="btn btn-primary mt-3 w-full">Open</button>
          {error && <p className="mt-3 text-[12px] text-husky-bad">{error}</p>}
        </form>
      </div>
    );
  }

  const visible = view.objectives.filter((objective) => !objective.hidden);
  const hidden = view.objectives.filter((objective) => objective.hidden);
  const people = view.sessions.length;

  return (
    <div className="h-full overflow-auto bg-husky-wall p-5">
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[17px] font-semibold tracking-tight">The Tellez Incident — board</h1>
        <span className="rounded-full border border-husky-edge px-2.5 py-0.5 text-[11px] text-husky-dim">
          {people} in the room
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px]",
            view.storage === "postgres"
              ? "border-husky-good/40 text-husky-good"
              : "border-husky-warn/50 text-husky-warn",
          )}
        >
          storage: {view.storage}
          {view.storage === "file" && " — set DATABASE_URL before the event"}
        </span>
        {!view.preflight.ok && (
          <span className="rounded-full border border-husky-bad/50 px-2.5 py-0.5 text-[11px] text-husky-bad">
            {view.preflight.problems.length} content problem(s)
          </span>
        )}
      </header>

      {!view.preflight.ok && (
        <ul className="mb-5 space-y-1 rounded-lg border border-husky-bad/40 bg-husky-bad/10 p-3 text-[11.5px] text-husky-bad">
          {view.preflight.problems.map((problem) => <li key={problem}>· {problem}</li>)}
        </ul>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <section>
          <h2 className="mb-2 text-[12px] uppercase tracking-wider text-husky-faint">
            Where the room is
          </h2>
          <div className="space-y-1.5">
            {visible.map((objective) => {
              const share = people === 0 ? 0 : Math.round((objective.reachedBy / people) * 100);
              return (
                <div key={objective.id} className="pane p-3">
                  <div className="flex items-baseline gap-2">
                    <span className="flex-1 text-[12.5px] font-medium">{objective.title}</span>
                    <span className="font-mono text-[12px] tabular-nums text-husky-dim">
                      {objective.reachedBy}/{people}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={cn("h-full rounded-full transition-all",
                        share === 0 ? "bg-husky-bad" : share < 50 ? "bg-husky-warn" : "bg-husky-good")}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                  {objective.note && (
                    <p className="mt-1.5 text-[11px] leading-snug text-husky-faint">{objective.note}</p>
                  )}
                </div>
              );
            })}
          </div>

          {hidden.length > 0 && (
            <>
              <h2 className="mb-2 mt-5 text-[12px] uppercase tracking-wider text-husky-faint">
                Hidden — players never see these
              </h2>
              <div className="pane divide-y divide-husky-edge">
                {hidden.map((objective) => (
                  <div key={objective.id} className="flex items-baseline gap-2 px-3 py-2">
                    <span className="flex-1 text-[12px]">{objective.title}</span>
                    <span className="font-mono text-[11.5px] text-husky-dim">
                      {objective.reachedBy}/{people}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-[12px] uppercase tracking-wider text-husky-faint">People</h2>
          <div className="pane divide-y divide-husky-edge">
            {view.sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-3 px-3 py-2">
                <span className="w-32 truncate text-[12.5px]">{session.displayName}</span>
                <span className="font-mono text-[11px] tabular-nums text-husky-accent">
                  {session.objectives.length}
                </span>
                <span className="flex-1 truncate text-[10.5px] text-husky-faint">
                  {Object.entries(session.counters)
                    .map(([name, count]) => `${name} ${count}`)
                    .join(" · ")}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-husky-faint">
                  {Math.round((view.now - session.lastSeenAt) / 1000)}s
                </span>
              </div>
            ))}
            {view.sessions.length === 0 && (
              <p className="px-3 py-4 text-center text-[12px] text-husky-faint">Nobody has joined yet.</p>
            )}
          </div>

          <h2 className="mb-2 mt-5 flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-husky-faint">
            <Icon name="Activity" size={13} /> Live
          </h2>
          <div className="pane max-h-80 overflow-auto divide-y divide-husky-edge font-mono text-[10.5px]">
            {view.recent.map((event) => (
              <div key={event.id} className="flex gap-2 px-3 py-1.5">
                <span className="w-16 shrink-0 text-husky-faint">
                  {new Date(event.at).toLocaleTimeString([], { hour12: false })}
                </span>
                <span className="w-28 shrink-0 text-husky-accent">{event.type}</span>
                <span className="truncate text-husky-dim">
                  {String(event.payload.path ?? event.payload.host ?? event.payload.id ?? event.payload.displayName ?? "")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
