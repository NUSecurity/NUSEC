import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { isBlocked, runChecks } from "@/bench/checks";
import { applyPreset, benchComplete, reconcile } from "@/bench/compose";
import { BenchState } from "@/bench/types";
import { decodeBench, emptyBench, encodeBench } from "@/bench/url";
import MatrixRain from "@/components/animations/MatrixRain";
import BenchRail, { Step } from "@/components/bench/BenchRail";
import Panel from "@/components/bench/Panel";
import PresetCards from "@/components/bench/PresetCards";
import PrintSheet from "@/components/bench/PrintSheet";
import ProjectPane from "@/components/bench/ProjectPane";
import ProvePane from "@/components/bench/ProvePane";
import ReviewPanel from "@/components/bench/ReviewPanel";
import SkillPane from "@/components/bench/SkillPane";
import { Button } from "@/components/ui/button";

/**
 * /bench — The Career Bench.
 *
 * Three tiles, one per field, resolving to a fixed statement: a project that
 * ends in something someone can look at, one skill moved up exactly one rung,
 * and a gate that could say no.
 *
 * One field at a time. All three at once was correct and unusable — a wall of
 * unfamiliar vocabulary is where someone new to this quietly closes the tab.
 * The rail keeps what's decided visible so the panels can stay small.
 *
 * All state lives in the URL. No accounts, no storage, no privacy surface.
 */
const CareerBench = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState<BenchState>(() =>
    decodeBench(location.search),
  );
  const [step, setStep] = useState<Step>(() =>
    // A shared link lands on the finished bench; a cold visit starts at examples.
    benchComplete(decodeBench(location.search)) ? "review" : "examples",
  );
  /** Which tile's brief is open. One at a time, across all panels. */
  const [open, setOpen] = useState<string | null>(null);

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
    setState((previous) => reconcile({ ...previous, ...patch }, previous));
  }, []);

  const toggleBrief = useCallback(
    (id: string) => setOpen((previous) => (previous === id ? null : id)),
    [],
  );

  const goTo = useCallback((next: Step) => {
    setStep(next);
    setOpen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const complete = benchComplete(state);
  const blocked = isBlocked(runChecks(state));
  const paneProps = { state, open, onToggleBrief: toggleBrief, onChange: change };

  return (
    <main className="relative min-h-screen bg-background print:min-h-0 print:bg-white">
      <MatrixRain className="pointer-events-none fixed inset-0 h-full w-full opacity-20 print:hidden" />

      {/* Paper gets its own layout rather than a stripped-down copy of the app. */}
      <PrintSheet state={state} />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-10 md:py-14 print:hidden">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ChevronLeft />
              Back
            </Link>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setState(emptyBench);
              goTo("examples");
            }}
          >
            <RotateCcw />
            Start over
          </Button>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              The Career Bench
            </span>
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Three decisions, one at a time. By the end you'll have a plan that
            fits in three sentences, a link you can paste anywhere, and a page
            you can print. You don't need to know any of this yet — every option
            explains itself, and nothing is locked in.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <BenchRail
            state={state}
            step={step}
            onStep={goTo}
            complete={complete}
            blocked={blocked}
          />

          <div className="min-w-0">
            {step === "examples" && (
              <Panel
                title="Start from an example"
                intro="Six benches other people could plausibly build. Load one to see how the three pieces fit together, then change whatever doesn't suit you — they're meant to be taken apart, not copied. Or skip straight to building your own."
                next={{
                  label: "Build my own instead",
                  onClick: () => goTo("project"),
                  ready: true,
                }}
              >
                <PresetCards
                  onLoad={(bench) => {
                    setState((previous) => applyPreset(previous, bench));
                    goTo("review");
                  }}
                />
              </Panel>
            )}

            {step === "project" && (
              <ProjectPane {...paneProps} onNext={() => goTo("skill")} />
            )}

            {step === "skill" && (
              <SkillPane {...paneProps} onNext={() => goTo("prove")} />
            )}

            {step === "prove" && (
              <ProvePane
                {...paneProps}
                onNext={() => goTo(complete ? "review" : "project")}
              />
            )}

            {step === "review" && <ReviewPanel state={state} />}
          </div>
        </div>

        <footer className="mt-12 max-w-3xl border-t border-border pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Something missing?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            If the thing you want to do isn't on here, add it — targets take about
            two lines, and a merged tile is itself a Tier-1 proof, so contributing
            to this is a bench item of its own.{" "}
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
    </main>
  );
};

export default CareerBench;
