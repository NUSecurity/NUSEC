import { api, ApiError } from "@/lib/api";
import { Icon } from "@/lib/icon";
import { rendererFor } from "@/sites/registry";
import type { PageResult } from "@/lib/api";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { AppProps, DesktopApp } from "./types";

const HOME = "start.huskyos.test";

function split(url: string): { host: string; path: string } {
  const cleaned = url.trim().replace(/^https?:\/\//i, "").replace(/^\/+/, "");
  const slash = cleaned.indexOf("/");
  return slash < 0
    ? { host: cleaned, path: "/" }
    : { host: cleaned.slice(0, slash), path: cleaned.slice(slash) };
}

/**
 * The in-world web browser.
 *
 * This is the extension point for OSINT trails and further portals: a site is
 * declarative data on the server plus a renderer registered on the client, and
 * this component neither knows nor cares which sites exist.
 */
function BrowserView({ arg }: AppProps) {
  const [address, setAddress] = useState(arg ?? "");
  const [page, setPage] = useState<PageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const go = useCallback(async (url: string) => {
    const { host, path } = split(url);
    if (!host) return;

    setBusy(true);
    setError(null);
    setAddress(host + (path === "/" ? "" : path));

    try {
      setPage(await api.page(host, path));
    } catch (cause) {
      setPage(null);
      setError(
        cause instanceof ApiError && cause.status === 403
          ? "You need to sign in to view this page."
          : `Can't reach ${host}. Check the address and try again.`,
      );
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (arg) void go(arg);
  }, [arg, go]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void go(address);
  }

  // Capitalised because it is rendered as JSX below, which is what gives it
  // its own hook context. See the note on SiteRenderer.
  const Renderer = page ? rendererFor(page.host, page.route) : undefined;

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={submit} className="flex items-center gap-1.5 border-b border-husky-edge px-2 py-1.5">
        <button type="button" onClick={() => void go(HOME)} className="btn px-2 py-1" aria-label="Home">
          <Icon name="House" size={14} />
        </button>
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Search or enter address"
          spellCheck={false}
          autoComplete="off"
          className="field flex-1 py-1 font-mono text-[12px]"
        />
        <button type="submit" disabled={busy} className="btn px-2 py-1" aria-label="Go">
          <Icon name={busy ? "Loader" : "ArrowRight"} size={14} className={busy ? "animate-spin" : ""} />
        </button>
      </form>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-[#0d1119]">
        {error && (
          <div className="flex h-full flex-col items-center justify-center gap-2.5 p-8 text-center">
            <Icon name="Unplug" size={28} className="text-husky-faint" />
            <p className="text-[13px] text-husky-dim">{error}</p>
            <p className="selectable font-mono text-[11px] text-husky-faint">{address}</p>
          </div>
        )}

        {!error && !page && !busy && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <Icon name="Globe" size={30} className="text-husky-accent/70" />
            <p className="text-[13px] text-husky-dim">Web Browser</p>
            <p className="max-w-xs text-[11.5px] text-husky-faint">
              Type an address above. There is no search engine on this machine.
            </p>
          </div>
        )}

        {page && !error && (
          // flex-1 inside a flex column gives the site a definite height, so a
          // short page fills the window instead of leaving a dark band below it.
          <div className="selectable flex min-h-full flex-1 flex-col [&>*]:flex-1">
            {Renderer ? (
              <Renderer
                host={page.host}
                path={page.path}
                data={page.data}
                navigate={(path) => void go(page.host + path)}
                signIn={async (username, password) => {
                  const result = await api.siteAuth(page.host, username, password);
                  if (result.ok) await go(page.host + "/dashboard");
                  return result;
                }}
              />
            ) : (
              <pre className="p-4 font-mono text-[11.5px] text-husky-dim">
                {JSON.stringify(page.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const browser: DesktopApp = {
  id: "browser",
  title: "Web Browser",
  icon: "Globe",
  opens: [],
  render: (props) => <BrowserView {...props} />,
};
