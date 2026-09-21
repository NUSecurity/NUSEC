import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { kits } from "@/bench";
import { applyPreset, reconcile } from "@/bench/compose";
import { BenchState } from "@/bench/types";
import { decodeBench, emptyBench, encodeBench } from "@/bench/url";
import MatrixRain from "@/components/animations/MatrixRain";
import BenchSummary from "@/components/bench/BenchSummary";
import PresetCards from "@/components/bench/PresetCards";
import ProjectPane from "@/components/bench/ProjectPane";
import ProvePane from "@/components/bench/ProvePane";
import SkillPane from "@/components/bench/SkillPane";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * /bench — The Career Bench.
 *
 * Three tiles, one per field, resolving to a fixed statement. The fixed
 * template is on purpose: every student's bench reads the same shape, which
 * makes them comparable in a room, pasteable into a co-op application, and
 * impossible to fill with mush.
 *
 * One tile per field. Not two. The constraint is most of the teaching — a
 * student who picks four projects hasn't decided anything, and this tool's job
 * is to make deciding feel survivable rather than optional.
 *
 * All state lives in the URL. No accounts, no storage, no privacy surface.
 */
const CareerBench = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState<BenchState>(() =>
    decodeBench(location.search),
  );
  /** Which tile's brief is open. One at a time, across all three panes. */
  const [open, setOpen] = useState<string | null>(null);

  // Re-read on back/forward so a shared link and the history both work.
  useEffect(() => {
    setState(decodeBench(location.search));
  }, [location.search]);

  const encoded = useMemo(() => encodeBench(state), [state]);

  // Mirror state into the URL without stacking a history entry per click.
  useEffect(() => {
    const current = location.search.replace(/^\?/, "");
    if (current !== encoded) {
      navigate({ search: encoded ? `?${encoded}` : "" }, { replace: true });
    }
  }, [encoded, location.search, navigate]);

  const change = useCallback((patch: Partial<BenchState>) => {
    setState((previous) => reconcile({ ...previous, ...patch }));
  }, []);

  const toggleBrief = useCallback(
    (id: string) => setOpen((previous) => (previous === id ? null : id)),
    [],
  );

  const toggleKit = (id: BenchState["kits"][number]) =>
    setState((previous) => ({
      ...previous,
      kits: previous.kits.includes(id)
        ? previous.kits.filter((kit) => kit !== id)
        : [...previous.kits, id],
    }));

  const paneProps = { state, open, onToggleBrief: toggleBrief, onChange: change };

  return (
    <main className="relative min-h-screen bg-background print:min-h-0">
      <MatrixRain className="pointer-events-none fixed inset-0 h-full w-full opacity-20 print:hidden" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-12 md:py-16 print:py-0">
        <Button asChild variant="outline" size="sm" className="mb-8 print:hidden">
          <Link to="/">
            <ChevronLeft />
            Back
          </Link>
        </Button>

        <header className="mb-8 print:mb-4">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            <span className="bg-gradient-primary bg-clip-text text-transparent print:text-foreground">
              The Career Bench
            </span>
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground print:hidden">
            Three tiles, one per field. A project that ends in something someone
            can look at, one skill moved up exactly one rung, and a gate that
            could say no. Pick one of each — the constraint is the point.
          </p>
        </header>

        {/* The bench itself stays at the top: it's the output, and it's the
            only part that prints. */}
        <div className="mb-8 print:mb-0">
          <BenchSummary state={state} onChange={change} />
        </div>

        <div className="print:hidden">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Start from a worked bench
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setState(emptyBench);
                setOpen(null);
              }}
            >
              <RotateCcw />
              Clear
            </Button>
          </div>

          <PresetCards
            onLoad={(bench) => setState((previous) => applyPreset(previous, bench))}
          />

          {/* Kit ownership drives the advisory "you'll need this first" check.
              It isn't a field of the bench, so it lives outside the panes. */}
          <div className="mt-6 rounded-lg border border-border bg-card/40 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              What you already have
            </h2>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
              Kit is the floor a project stands on, not a project. Tick what you
              own and the tool stops telling you to buy it — leave it unticked
              and it'll say what the project needs before you start, with the
              cost, rather than three weeks in.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {kits.map((kit) => {
                const owned = state.kits.includes(kit.id);

                return (
                  <label
                    key={kit.id}
                    title={`${kit.cost} — ${kit.brief}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors",
                      owned
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/60",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={owned}
                      onChange={() => toggleKit(kit.id)}
                      className="h-3.5 w-3.5 accent-[hsl(var(--primary))]"
                    />
                    {kit.name}
                  </label>
                );
              })}
            </div>
          </div>

          {/* The three panes. */}
          <div className="mt-6 grid items-start gap-4 lg:grid-cols-3">
            <ProjectPane {...paneProps} />
            <SkillPane {...paneProps} />
            <ProvePane {...paneProps} />
          </div>

          <footer className="mt-10 rounded-lg border border-border bg-card/40 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              When to re-bench
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              When any one slot completes, re-bench all three. Finishing the
              project changes what proof is available; passing the cert changes
              what the next skill should be; landing the talk changes the
              project's audience. The three are coupled, so completing one
              invalidates the other two's assumptions. No dates, no check-in
              cadence — one rule, and it holds whether you finish in three weeks
              or eight months.
            </p>

            <h2 className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Missing a tile?
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Add it. Targets are the easiest contribution — a couple of lines in{" "}
              <code className="rounded bg-secondary px-1 py-0.5 text-xs">
                src/bench/tiles/
              </code>{" "}
              — and a merged tile is a Tier-1 Prove item of your own, which
              means the contribution model and the product concept are the same
              loop.{" "}
              <a
                href="https://github.com/NUSecurity/NUSEC/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline underline-offset-2"
              >
                How to write a tile
              </a>
              .
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default CareerBench;
