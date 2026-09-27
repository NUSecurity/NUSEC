import { api, ApiError } from "@/lib/api";
import { Icon } from "@/lib/icon";
import { useState, type FormEvent } from "react";

/**
 * The first challenge.
 *
 * The clue is not on this machine — Alec's old posts in the real NUSEC Discord
 * are the source. Everything behind this screen is refused by the server until
 * it is passed, so this is a gate and not a curtain.
 */
export function LockScreen({ onUnlocked }: { onUnlocked(): void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setHint(null);

    try {
      const result = await api.login(username, password);
      if (result.ok) return onUnlocked();

      setError(result.message ?? "That did not work.");
      setHint(result.hint ?? null);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wallpaper flex h-full flex-col items-center justify-center px-6">
      <div className="mb-10 text-center">
        <p className="font-mono text-6xl font-light tracking-tight text-white/90">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="mt-1 text-sm text-husky-dim">
          {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      <form onSubmit={submit} className="pane w-full max-w-xs p-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-husky-accent/15 ring-1 ring-husky-accent/30">
          <Icon name="User" size={30} className="text-husky-accent" />
        </div>

        <p className="text-sm font-medium">Alec Tellez</p>
        <p className="mb-5 text-[11px] text-husky-faint">NUSEC-PRES-01 · locked</p>

        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          autoComplete="off"
          autoFocus
          className="field mb-2 text-center text-sm"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="off"
          className="field text-center text-sm"
        />

        <button type="submit" disabled={busy} className="btn btn-primary mt-4 w-full">
          {busy ? "Checking…" : "Sign in"}
        </button>

        {error && (
          <p className="mt-3 text-[12px] text-husky-bad" role="alert">
            {error}
          </p>
        )}

        {hint && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-husky-warn">
            <Icon name="Lightbulb" size={13} className="shrink-0" />
            <span>{hint}</span>
          </p>
        )}

        <p className="mt-5 border-t border-husky-edge pt-4 text-[11px] leading-relaxed text-husky-faint">
          Seized 22 Sep 2026. He was not careful about where he talked about
          himself.
        </p>
      </form>
    </div>
  );
}
