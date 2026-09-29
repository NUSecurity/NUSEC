import { api } from "@/lib/api";
import { Icon } from "@/lib/icon";
import type { ApprovalRequest } from "#shared/protocol";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppProps, DesktopApp } from "./types";

/** How often the app asks for new sign-in requests while it is on screen. */
const POLL_MS = 3000;

const clock = (at: number) =>
  at ? new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";

interface Decided {
  key: string;
  site: string;
  request: string;
  decision: "approve" | "deny";
  at: number;
}

/**
 * The Authenticator — the second factor for Classified.
 *
 * On the desktop from the start, showing nothing, so that it is already
 * familiar furniture when a sign-in request finally lands in it. The requests
 * come from the server, which only lists one once the password step before it
 * has been passed; approving or denying goes back to the server too.
 *
 * It polls only while it is actually on screen. Inactive apps stay mounted and
 * are hidden with CSS (ARCHITECTURE.md §6), and forty hidden authenticators
 * each asking every few seconds would be load for nothing.
 */
function AuthenticatorView(_props: AppProps) {
  const root = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState<ApprovalRequest[] | null>(null);
  const [decided, setDecided] = useState<Decided[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRequests((await api.approvals("authenticator")).requests);
    } catch {
      setRequests((current) => current ?? []);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      // A display:none ancestor leaves no offsetParent — that is "hidden".
      if (root.current?.offsetParent) void load();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  async function decide(request: ApprovalRequest, decision: "approve" | "deny") {
    setBusy(request.challenge);
    try {
      const result = await api.answerChallenge({ challenge: request.challenge, decision });
      if (result.ok) {
        setDecided((current) => [
          { key: `${request.challenge}-${Date.now()}`, site: request.site, request: request.request, decision, at: Date.now() },
          ...current,
        ].slice(0, 5));
      }
    } finally {
      setBusy(null);
      await load();
    }
  }

  return (
    <div ref={root} className="mx-auto flex h-full w-full max-w-md flex-col gap-4 p-5">
      <header className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-husky-accent/15">
          <Icon name="ShieldCheck" size={19} className="text-husky-accent" />
        </span>
        <div>
          <p className="text-[14px] font-medium">Authenticator</p>
          <p className="text-[11px] text-husky-faint">Sign-in requests</p>
        </div>
      </header>

      {requests === null && <p className="text-[12px] text-husky-faint">Checking for requests…</p>}

      {requests?.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-husky-edge bg-white/[0.03] px-4 py-10 text-center">
          <Icon name="BellOff" size={22} className="text-husky-faint" />
          <p className="text-[12.5px] text-husky-dim">No pending requests</p>
          <p className="max-w-[26ch] text-[11px] text-husky-faint">
            When you sign in somewhere that asks for approval, it will appear here.
          </p>
        </div>
      )}

      {requests?.map((request) => (
        <div key={request.challenge} className="rounded-lg border border-husky-accent/40 bg-husky-accent/[0.06] p-4">
          <div className="mb-3 flex items-start gap-2.5">
            <Icon name="BellRing" size={16} className="mt-0.5 shrink-0 text-husky-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium">{request.site}</p>
              <p className="text-[12px] text-husky-dim">{request.request}</p>
              <p className="mt-1 truncate font-mono text-[10.5px] text-husky-faint">
                {request.host} · {clock(request.at)}
              </p>
            </div>
          </div>

          <p className="mb-3 text-[12px]">Approve sign-in?</p>
          <div className="flex gap-2">
            <button
              onClick={() => void decide(request, "deny")}
              disabled={busy !== null}
              className="btn flex-1"
            >
              Deny
            </button>
            <button
              onClick={() => void decide(request, "approve")}
              disabled={busy !== null}
              className="btn btn-primary flex-1"
            >
              Approve
            </button>
          </div>
        </div>
      ))}

      {decided.length > 0 && (
        <section className="mt-auto">
          <p className="mb-1.5 text-[10.5px] uppercase tracking-wide text-husky-faint">Recent</p>
          {decided.map((entry) => (
            <p key={entry.key} className="flex items-center gap-2 border-t border-husky-edge py-1.5 text-[11.5px] text-husky-dim">
              <Icon
                name={entry.decision === "approve" ? "CircleCheck" : "CircleX"}
                size={13}
                className={entry.decision === "approve" ? "text-emerald-400" : "text-red-400"}
              />
              <span className="flex-1 truncate">{entry.site} — {entry.request}</span>
              <span className="font-mono text-[10.5px] text-husky-faint">
                {entry.decision === "approve" ? "Approved" : "Denied"} {clock(entry.at)}
              </span>
            </p>
          ))}
        </section>
      )}
    </div>
  );
}

export const authenticator: DesktopApp = {
  id: "authenticator",
  title: "Authenticator",
  icon: "ShieldCheck",
  opens: [],
  render: (props) => <AuthenticatorView {...props} />,
};
