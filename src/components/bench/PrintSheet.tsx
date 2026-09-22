import {
  getArtifact,
  getKit,
  getPattern,
  getProve,
  getSkill,
  getTarget,
  resourcesFor,
} from "@/bench";
import { runChecks } from "@/bench/checks";
import { BenchState, rungLabels, rungOrder } from "@/bench/types";
import BenchSentences from "@/components/bench/BenchSentences";

const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <section className="break-inside-avoid">
    <h2 className="border-b border-neutral-300 pb-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
      {label}
    </h2>
    <div className="mt-1.5">{children}</div>
  </section>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <p className="mt-1 text-[0.7rem] leading-snug">
    <span className="font-semibold text-neutral-600">{label}: </span>
    <span className="text-black">{children}</span>
  </p>
);

/**
 * The one-page takeaway.
 *
 * Students at a meeting want to leave with something physical, and a sheet
 * with three sentences on it is not worth the paper. This carries the whole
 * bench: what each choice commits you to, where each one starts, what to watch
 * for, the timing on the gate, and the handful of links behind the skill.
 *
 * Rendered only for print — see the print rules in index.css.
 */
const PrintSheet = ({ state }: { state: BenchState }) => {
  const pattern = state.pattern ? getPattern(state.pattern) : null;
  const target = state.target ? getTarget(state.target) : null;
  const artifact = state.artifact ? getArtifact(state.artifact) : null;
  const skill = state.skill ? getSkill(state.skill) : null;
  const prove = state.prove ? getProve(state.prove) : null;

  // The advisories live here rather than on the finished bench on screen. On
  // screen they already appeared in the panel they apply to; on paper there was
  // no panel, so this is the only place they can be said.
  const checks = runChecks(state);

  // A handful, not the whole pool — this has to fit on paper.
  const resources = skill
    ? resourcesFor(skill.id)
        .filter((resource) => resource.last_verified)
        .slice(0, 6)
    : [];

  return (
    <div className="hidden print:block print:text-black">
      <header className="mb-3 flex items-baseline justify-between border-b-2 border-black pb-2">
        <h1 className="text-lg font-bold">The Career Bench</h1>
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
          NUSEC
        </span>
      </header>

      <div className="mb-4 text-sm">
        <BenchSentences state={state} />
      </div>

      <div className="space-y-3">
        {pattern && target && artifact && (
          <Section label={`Project — ${pattern.name} · ${target.name}`}>
            <Row label="Start by">{pattern.first_move}</Row>
            <Row label="Get one">{target.sourcing}</Row>
            <Row label="Cost">{target.cost}</Row>
            <Row label="Common pitfalls">{target.gotchas}</Row>
            <Row label="Ends in">{artifact.name} — {artifact.brief}</Row>
            {target.requires_kits.length > 0 && (
              <Row label="You'll need">
                {target.requires_kits
                  .map((kit) => `${getKit(kit).name} (${getKit(kit).cost})`)
                  .join("; ")}
              </Row>
            )}
          </Section>
        )}

        {skill && state.to && (
          <Section label={`Skill — ${skill.name} → ${rungLabels[state.to]}`}>
            <Row label="Start by">{skill.first_move}</Row>
            <Row label="Common pitfalls">{skill.failure_mode}</Row>
            <div className="mt-1.5">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                The ladder — tick as you clear each one
              </p>
              <ul className="mt-1 space-y-0.5">
                {rungOrder.map((rung) => {
                  const cleared =
                    state.from !== null &&
                    rungOrder.indexOf(state.from) >= rungOrder.indexOf(rung);
                  const isTarget = state.to === rung;

                  return (
                    <li
                      key={rung}
                      className="flex items-start gap-1.5 text-[0.7rem] leading-snug"
                    >
                      <span className="mt-[0.15rem] inline-block h-2.5 w-2.5 shrink-0 border border-neutral-500">
                        {cleared && (
                          <span className="block h-full w-full bg-neutral-700" />
                        )}
                      </span>
                      <span>
                        <span
                          className={
                            isTarget ? "font-bold" : "font-semibold text-neutral-600"
                          }
                        >
                          {rungLabels[rung]}
                          {isTarget && " ← you're going here"}
                        </span>
                        {" — "}
                        {skill.rungs[rung]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Section>
        )}

        {prove && (
          <Section label={`Prove — ${prove.name}`}>
            <Row label="Start by">{prove.first_move}</Row>
            <Row label="Who can say no">{prove.gatekeeper}</Row>
            <Row label="Timing">
              {prove.window.note} {prove.lead_time}.
            </Row>
            <Row label="Cost">{prove.cost}</Row>
            <Row label="Common pitfalls">{prove.failure_mode}</Row>
            {prove.links?.some((link) => link.last_verified) && (
              <Row label="Official page">
                {prove.links
                  .filter((link) => link.last_verified)
                  .map((link) => link.url)
                  .join("  ")}
              </Row>
            )}
          </Section>
        )}

        {resources.length > 0 && skill && (
          <Section label={`Resources — ${skill.name}`}>
            <ul className="mt-1 space-y-0.5">
              {resources.map((resource) => (
                <li key={resource.url} className="text-[0.68rem] leading-snug">
                  <span className="font-semibold">{resource.title}</span>
                  {resource.paid && (
                    <span className="text-neutral-500"> (paid)</span>
                  )}
                  <span className="text-neutral-600"> — {resource.url}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {checks.length > 0 && (
        <div className="mt-3">
          <Section label="Worth knowing">
            <ul className="mt-1 space-y-0.5">
              {checks.map((check) => (
                <li key={check.id} className="text-[0.7rem] leading-snug">
                  <span className="font-semibold text-neutral-600">
                    {check.message}
                  </span>
                  {check.detail && (
                    <span className="text-black"> {check.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      <footer className="mt-4 border-t border-neutral-300 pt-2 text-[0.6rem] leading-snug text-neutral-500">
        When any one of the three finishes, rebuild all three — finishing one
        makes the other two's assumptions out of date. Your bench lives in the
        URL, so the link you copied still works later.
      </footer>
    </div>
  );
};

export default PrintSheet;
