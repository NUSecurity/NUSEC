import { Icon } from "@/lib/icon";
import type { ChallengeView } from "#shared/protocol";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { SiteContext } from "./types";

/**
 * The current step of a site challenge, for any site to drop into its own page.
 *
 * Presentation only. The server says which step the session is on and what it
 * asks; this renders that one step and posts the answer. Nothing here knows
 * how many steps remain beyond the "of" the server chose to send, and no
 * answer is ever checked in the browser.
 */

/** How often a page waiting on an approval asks whether it has arrived. */
const APPROVAL_POLL_MS = 3000;

export function ChallengeGate({
  ctx,
  challenge,
  brand,
  accent = "#0e2a47",
}: {
  ctx: SiteContext;
  challenge: ChallengeView;
  /** The site's own name and mark, shown at the top of the card. */
  brand: ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#f6f8fb] p-8 text-[#16202e]">
      <div className="w-full max-w-sm rounded-lg border border-[#d6dee8] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          {brand}
          <span className="font-mono text-[10.5px] text-[#94a3b8]">
            Step {challenge.step} of {challenge.of}
          </span>
        </div>

        {challenge.notice === "denied" && (
          <p className="mb-4 rounded border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#b91c1c]">
            The sign-in request was denied. Start again.
          </p>
        )}

        <p className="mb-4 text-[12.5px] leading-relaxed text-[#475569]">{challenge.prompt}</p>

        {/* Keyed by step, so a new step never inherits the last one's typing. */}
        {challenge.kind === "approval"
          ? <Approval key={challenge.step} ctx={ctx} />
          : <Answers key={challenge.step} ctx={ctx} challenge={challenge} accent={accent} />}
      </div>
    </div>
  );
}

function Approval({ ctx }: { ctx: SiteContext }) {
  // The approval happens in another app, so this page has nothing to submit —
  // it just keeps asking the server until the step moves on. It stops the
  // moment it unmounts, which is as soon as the step changes. The ref matters:
  // the browser hands over a fresh `ctx` on every render, and depending on it
  // would restart the timer each time a poll landed.
  const refresh = useRef(ctx.refresh);
  refresh.current = ctx.refresh;

  useEffect(() => {
    const timer = window.setInterval(() => void refresh.current(), APPROVAL_POLL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 rounded border border-[#e2e8f0] bg-[#f8fafc] px-4 py-6 text-center">
      <Icon name="Smartphone" size={26} className="text-[#64748b]" />
      <p className="flex items-center gap-2 text-[12px] text-[#64748b]">
        <Icon name="Loader" size={13} className="animate-spin" />
        Waiting for approval…
      </p>
    </div>
  );
}

function Answers({ ctx, challenge, accent }: { ctx: SiteContext; challenge: ChallengeView; accent: string }) {
  const fields = challenge.kind === "questions" ? challenge.questions ?? [] : [challenge.label ?? "Answer"];
  const [values, setValues] = useState<string[]>(() => fields.map(() => ""));
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const result = await ctx.answerChallenge(
      challenge.kind === "questions" ? { answers: values } : { answer: values[0] },
    );
    if (!result.ok) setMessage(result.message ?? "That was not accepted.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit}>
      {fields.map((label, index) => (
        <div key={label} className="mb-3">
          <label className="mb-1 block text-[11px] font-medium text-[#475569]">{label}</label>
          <input
            type={challenge.kind === "secret" ? "password" : "text"}
            value={values[index]}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              setValues(next);
            }}
            autoComplete="off"
            spellCheck={false}
            autoFocus={index === 0}
            className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[13px] outline-none focus:border-[#0e2a47]"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={busy}
        style={{ backgroundColor: accent }}
        className="mt-1 w-full rounded py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Checking…" : "Continue"}
      </button>

      {message && <p className="mt-3 text-[12px] text-[#b91c1c]">{message}</p>}
    </form>
  );
}
