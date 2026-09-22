import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { isBlocked, runChecks } from "@/bench/checks";
import { applyPreset, benchComplete, reconcile } from "@/bench/compose";
import { BenchState } from "@/bench/types";
import { decodeBench, emptyBench, encodeBench } from "@/bench/url";
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
 * Three decisions: a project that ends in something someone can look at, one
 * skill moved up exactly one level, and a gate that could say no.
 *
 * Laid out as an application rather than a document. On a large screen nothing
 * outside a pane scrolls — the header and rail stay put, and each column of
 * cards keeps its own scroll position. Cards are small; everything that used to
 * crowd them lives in the full-screen view behind the ⓘ, which holds
 * considerably more than the cards ever did.
 *
 * Below `lg` it falls back to ordinary page scrolling, because a locked
 * viewport on a phone fights the browser chrome and loses.
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
  /** Which tile's full-screen view is open. */
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

  const goTo = useCallback((next: Step) => {
    setStep(next);
    setOpen(null);
  }, []);

  const complete = benchComplete(state);
  const blocked = isBlocked(runChecks(state));
  const paneProps = { state, open, onOpen: setOpen, onChange: change };

  return (
    <>
      {/* Paper gets its own layout rather than a stripped-down copy of the app. */}
      <PrintSheet state={state} />

      <main className="flex flex-col bg-background lg:h-screen lg:overflow-hidden print:hidden">
        <header className="shrink-0 border-b border-border">
          <div className="container mx-auto flex max-w-[110rem] items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ChevronLeft />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-base font-bold leading-tight">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    The Career Bench
                  </span>
                </h1>
                <p className="text-xs leading-tight text-muted-foreground">
                  Three decisions, one at a time. Nothing is locked in.
                </p>
              </div>
            </div>

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
        </header>

        <div className="container mx-auto grid min-h-0 max-w-[110rem] flex-1 gap-7 px-5 py-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="min-h-0 lg:overflow-y-auto lg:pr-2">
            <BenchRail
              state={state}
              step={step}
              onStep={goTo}
              complete={complete}
              blocked={blocked}
            />
          </div>

          <div className="flex min-h-0 min-w-0 flex-col">
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

            {step === "review" && <ReviewPanel state={state} onOpen={setOpen} />}
          </div>
        </div>
      </main>
    </>
  );
};

export default CareerBench;
