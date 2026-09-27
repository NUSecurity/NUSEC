import { Icon } from "@/lib/icon";
import { useState, type FormEvent, type ReactNode } from "react";
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
  const { signedInAs } = ctx.data as { signedInAs?: string };

  const tabs = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/invoices", label: "Invoices" },
    { path: "/payouts", label: "Payouts" },
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

export const brightlinePay: SiteRenderers = {
  host: "ledger.brightlinepay.test",
  routes: {
    "/": Login,
    "/dashboard": Dashboard,
    "/invoices": (ctx) => <TablePage ctx={ctx} active="/invoices" heading="Invoices" />,
    "/payouts": (ctx) => <TablePage ctx={ctx} active="/payouts" heading="Payouts" />,
  },
};
