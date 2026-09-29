import { Icon } from "@/lib/icon";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChallengeGate } from "../ChallengeGate";
import type { SiteContext, SiteRenderers } from "../types";

/**
 * Brightline Pay — the vendor console.
 *
 * Presentation only. Every figure on these pages arrives from the route's
 * `data` on the server, and the protected routes are never serialised at all
 * until the session has passed the auth wall — so "view source" on the sign-in
 * page shows a sign-in page and nothing else.
 */

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function Chrome({ ctx, active, children }: { ctx: SiteContext; active: string; children: ReactNode }) {
  // Read from the route data, never hardcoded: the portal username is the
  // answer to the base64 step, and a literal here would ship it in the bundle
  // for anyone who opened devtools.
  // `data` is null while a challenge stands in front of the page.
  const { signedInAs } = (ctx.data ?? {}) as { signedInAs?: string };

  const tabs = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/invoices", label: "Invoices" },
    { path: "/payouts", label: "Payouts" },
    { path: "/classified", label: "Classified" },
  ];

  return (
    <div className="min-h-full bg-[#f6f8fb] text-[#16202e]">
      <header className="flex items-center gap-3 bg-[#0e2a47] px-5 py-3 text-white">
        <Icon name="Landmark" size={18} className="text-[#7fc4ff]" />
        <span className="text-[14px] font-semibold tracking-tight">Brightline Pay</span>
        <nav className="ml-6 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => ctx.navigate(tab.path)}
              className={`rounded px-2.5 py-1 text-[12px] transition-colors ${
                active === tab.path ? "bg-white/20 font-medium" : "hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <span className="ml-auto font-mono text-[11px] text-white/60">{signedInAs}</span>
      </header>

      <main className="p-5">{children}</main>
    </div>
  );
}

function Login(ctx: SiteContext) {
  const data = ctx.data as { tagline?: string; notice?: string };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const result = await ctx.signIn(username, password);
    if (!result.ok) setMessage(result.message ?? "Those credentials were not accepted.");
    setBusy(false);
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[#f6f8fb] p-8 text-[#16202e]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-[#d6dee8] bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <Icon name="Landmark" size={18} className="text-[#0e2a47]" />
          <span className="text-[15px] font-semibold">Brightline Pay</span>
        </div>
        <p className="mb-5 text-[12px] text-[#64748b]">{data.tagline}</p>

        <label className="mb-1 block text-[11px] font-medium text-[#475569]">Username</label>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="mb-3 w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[13px] outline-none focus:border-[#0e2a47]"
        />

        <label className="mb-1 block text-[11px] font-medium text-[#475569]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="off"
          className="mb-4 w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[13px] outline-none focus:border-[#0e2a47]"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-[#0e2a47] py-2 text-[13px] font-medium text-white hover:bg-[#143a61] disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        {message && <p className="mt-3 text-[12px] text-[#b91c1c]">{message}</p>}

        <p className="mt-5 border-t border-[#e2e8f0] pt-3 text-[11px] text-[#94a3b8]">{data.notice}</p>
      </form>
    </div>
  );
}

function Dashboard(ctx: SiteContext) {
  const data = ctx.data as {
    account: string; accountId: string; settled: number; pending: number;
    since: string; contact: string;
  };

  const tiles = [
    { label: "Settled to date", value: money(data.settled) },
    { label: "Pending", value: money(data.pending) },
    { label: "Vendor since", value: data.since },
  ];

  return (
    <Chrome ctx={ctx} active="/dashboard">
      <h1 className="text-[18px] font-semibold">{data.account}</h1>
      <p className="mb-5 font-mono text-[11px] text-[#64748b]">
        {data.accountId} · {data.contact}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-lg border border-[#d6dee8] bg-white p-4">
            <p className="text-[11px] uppercase tracking-wide text-[#64748b]">{tile.label}</p>
            <p className="mt-1 text-[20px] font-semibold tabular-nums">{tile.value}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => ctx.navigate("/payouts")}
        className="mt-5 rounded bg-[#0e2a47] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#143a61]"
      >
        View payouts
      </button>
    </Chrome>
  );
}

function TablePage({ ctx, active, heading }: { ctx: SiteContext; active: string; heading: string }) {
  const data = ctx.data as {
    columns: string[];
    rows: (string | number)[][];
    footnote?: string;
    totals?: { in: number; out: number; retained: number };
  };

  return (
    <Chrome ctx={ctx} active={active}>
      <h1 className="mb-4 text-[18px] font-semibold">{heading}</h1>

      <div className="overflow-hidden rounded-lg border border-[#d6dee8] bg-white">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="bg-[#eef2f7] text-left">
              {data.columns.map((column) => (
                <th key={column} className="px-3 py-2 font-medium text-[#334155]">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index} className="border-t border-[#e2e8f0]">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-3 py-2 ${typeof cell === "number" ? "text-right font-mono tabular-nums" : ""}`}
                  >
                    {typeof cell === "number" ? money(cell) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totals && (
        <div className="mt-3 flex flex-wrap gap-5 rounded-lg border border-[#d6dee8] bg-white px-4 py-3 text-[12.5px]">
          <span>Received <strong className="font-mono tabular-nums">{money(data.totals.in)}</strong></span>
          <span>Disbursed <strong className="font-mono tabular-nums">{money(data.totals.out)}</strong></span>
          <span className="text-[#b91c1c]">
            Retained <strong className="font-mono tabular-nums">{money(data.totals.retained)}</strong>
          </span>
        </div>
      )}

      {data.footnote && (
        <p className="mt-3 max-w-2xl text-[11.5px] leading-relaxed text-[#64748b]">{data.footnote}</p>
      )}
    </Chrome>
  );
}

/**
 * The Classified tab. Its routes and its three-step gate are declared by the
 * `classified` module; until the gate is passed the server sends the current
 * step instead of any of these pages' data.
 *
 * Each section is its own route rather than an in-page tab, so opening one is
 * a request the server sees — that is how the board knows who has read the
 * message log, not just who got through the gate.
 */
const SECTIONS = [
  { path: "/classified", label: "Transfers", icon: "ArrowRightLeft" },
  { path: "/classified/documents", label: "Documents", icon: "FileText" },
  { path: "/classified/messages", label: "Messages", icon: "MessagesSquare" },
];

function ClassifiedShell({ ctx, section, children }: { ctx: SiteContext; section: string; children: ReactNode }) {
  if (ctx.challenge) {
    return (
      <Chrome ctx={ctx} active="/classified">
        <ChallengeGate
          ctx={ctx}
          challenge={ctx.challenge}
          brand={
            <span className="flex items-center gap-2">
              <Icon name="Lock" size={16} className="text-[#0e2a47]" />
              <span className="text-[14px] font-semibold">Classified</span>
            </span>
          }
        />
      </Chrome>
    );
  }

  return (
    <Chrome ctx={ctx} active="/classified">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="flex items-center gap-2 text-[18px] font-semibold">
          <Icon name="LockOpen" size={17} className="text-[#0e2a47]" />
          Classified
        </h1>
        <nav className="flex gap-1 rounded-md border border-[#d6dee8] bg-white p-0.5">
          {SECTIONS.map((item) => (
            <button
              key={item.path}
              onClick={() => ctx.navigate(item.path)}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] transition-colors ${
                section === item.path ? "bg-[#0e2a47] font-medium text-white" : "text-[#475569] hover:bg-[#eef2f7]"
              }`}
            >
              <Icon name={item.icon} size={13} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      {children}
    </Chrome>
  );
}

function ClassifiedTransfers(ctx: SiteContext) {
  const data = ctx.data as {
    columns: string[]; rows: (string | number)[][]; total: number; footnote: string;
  } | null;

  return (
    <ClassifiedShell ctx={ctx} section="/classified">
      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-[#d6dee8] bg-white">
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr className="bg-[#eef2f7] text-left">
                  {data.columns.map((column) => (
                    <th key={column} className="whitespace-nowrap px-3 py-2 font-medium text-[#334155]">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, index) => (
                  <tr key={index} className="border-t border-[#e2e8f0]">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-3 py-2 ${typeof cell === "number" ? "text-right font-mono tabular-nums" : ""}`}
                      >
                        {typeof cell === "number" ? money(cell) : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-lg border border-[#d6dee8] bg-white px-4 py-3 text-[12.5px]">
            Forwarded in total <strong className="font-mono tabular-nums text-[#b91c1c]">{money(data.total)}</strong>
          </div>

          <p className="mt-3 max-w-2xl text-[11.5px] leading-relaxed text-[#64748b]">{data.footnote}</p>
        </>
      )}
    </ClassifiedShell>
  );
}

function ClassifiedDocuments(ctx: SiteContext) {
  const data = ctx.data as { documents: { title: string; meta: string; body: string }[] } | null;

  return (
    <ClassifiedShell ctx={ctx} section="/classified/documents">
      {data?.documents.map((doc) => (
        <article key={doc.title} className="mb-3 overflow-hidden rounded-lg border border-[#d6dee8] bg-white">
          <header className="flex items-center gap-2 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-2">
            <Icon name="FileLock" size={14} className="text-[#64748b]" />
            <h2 className="flex-1 text-[13px] font-semibold">{doc.title}</h2>
            <span className="font-mono text-[10.5px] text-[#94a3b8]">{doc.meta}</span>
          </header>
          <pre className="overflow-x-auto whitespace-pre px-4 py-3 font-mono text-[11.5px] leading-relaxed text-[#334155]">
            {doc.body}
          </pre>
        </article>
      ))}
    </ClassifiedShell>
  );
}

/** "2026-09-28 19:42", the shape the log's own timestamps use. */
function stamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type Message = { from: string; at: string; body: string };

function ClassifiedMessages(ctx: SiteContext) {
  const data = ctx.data as { title: string; participants: string[]; messages: Message[] } | null;

  // Messages the player "sends" as Alec. They live in this component and
  // nowhere else — no request is made — so the chat feels live without
  // anything leaving the page. They are gone once the page is left, which the
  // relock guarantees anyway.
  const [sent, setSent] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sent.length > 0) end.current?.scrollIntoView({ block: "nearest" });
  }, [sent.length]);

  function send(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setSent((current) => [...current, { from: "Alec", at: stamp(new Date()), body }]);
    setDraft("");
  }

  const all = data ? [...data.messages, ...sent] : [];

  return (
    <ClassifiedShell ctx={ctx} section="/classified/messages">
      {data && (
        <div className="overflow-hidden rounded-lg border border-[#d6dee8] bg-white">
          <header className="border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5">
            <p className="text-[13px] font-semibold">{data.participants.join("  ↔  ")}</p>
            <p className="text-[11px] text-[#94a3b8]">{data.title} · {all.length} messages</p>
          </header>

          <div className="flex flex-col gap-1.5 px-4 py-4">
            {all.map((message, index) => {
              const mine = message.from === "Alec";
              const day = message.at.slice(0, 10);
              const newDay = index === 0 || all[index - 1].at.slice(0, 10) !== day;

              return (
                <div key={index} className="flex flex-col">
                  {newDay && (
                    <p className="my-2 text-center font-mono text-[10.5px] text-[#94a3b8]">{day}</p>
                  )}
                  <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-[12.5px] leading-snug ${
                        mine ? "rounded-br-sm bg-[#0e2a47] text-white" : "rounded-bl-sm bg-[#eef2f7] text-[#16202e]"
                      }`}
                    >
                      {!mine && <p className="mb-0.5 text-[10.5px] font-semibold text-[#64748b]">{message.from}</p>}
                      <p className="whitespace-pre-wrap">{message.body}</p>
                      <p className={`mt-0.5 text-right font-mono text-[9.5px] ${mine ? "text-white/50" : "text-[#94a3b8]"}`}>
                        {message.at.slice(11)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={end} />
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Message Jessica James Okafor"
              autoComplete="off"
              className="flex-1 rounded-full border border-[#cbd5e1] bg-white px-3.5 py-1.5 text-[12.5px] outline-none focus:border-[#0e2a47]"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0e2a47] text-white hover:bg-[#143a61] disabled:opacity-40"
            >
              <Icon name="SendHorizontal" size={14} />
            </button>
          </form>
        </div>
      )}
    </ClassifiedShell>
  );
}

export const brightlinePay: SiteRenderers = {
  host: "ledger.brightlinepay.hack",
  routes: {
    "/": Login,
    "/dashboard": Dashboard,
    "/invoices": (ctx) => <TablePage ctx={ctx} active="/invoices" heading="Invoices" />,
    "/payouts": (ctx) => <TablePage ctx={ctx} active="/payouts" heading="Payouts" />,
    "/classified": ClassifiedTransfers,
    "/classified/documents": ClassifiedDocuments,
    "/classified/messages": ClassifiedMessages,
  },
};
