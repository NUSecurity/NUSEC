import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import FlagSubmit from "@/components/ctf/FlagSubmit";
import { CategoryBadge, DifficultyBadge } from "@/components/ctf/badges";
import { Button } from "@/components/ui/button";
import { getChallenge } from "@/ctf/meetings";
import { useProgress } from "@/ctf/progress";
import NotFound from "@/pages/NotFound";

/** /challenges/:meetingSlug/:challengeSlug — one challenge's brief and flag box. */
const ChallengePage = () => {
  const { meetingSlug, challengeSlug } = useParams();
  const found = getChallenge(meetingSlug, challengeSlug);

  // Hooks run unconditionally so the early return below is safe.
  const { solved, markSolved } = useProgress(meetingSlug ?? "");
  const [hintsShown, setHintsShown] = useState(0);

  if (!found) return <NotFound />;

  const { meeting, challenge } = found;
  const isArchived = meeting.active === false;
  const hints = challenge.hints ?? [];

  const index = meeting.challenges.findIndex((c) => c.slug === challenge.slug);
  const next = meeting.challenges[index + 1];

  return (
    <CtfLayout
      backTo={`/challenges/${meeting.slug}`}
      backLabel={`All ${meeting.title} challenges`}
    >
      <article>
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <CategoryBadge category={challenge.category} />
            <DifficultyBadge difficulty={challenge.difficulty} />
            <span className="font-mono text-sm text-muted-foreground">
              {challenge.points} pts
            </span>
            {solved.has(challenge.slug) && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-green-500">
                <CheckCircle2 className="h-4 w-4" /> Solved
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {challenge.title}
          </h1>
        </header>

        {/* Brief */}
        <section className="space-y-4">
          {challenge.brief.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>

        {/* Assets */}
        {challenge.assets && challenge.assets.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Files
            </h2>
            <ul className="space-y-2">
              {challenge.assets.map((asset) => (
                <li key={asset.href}>
                  <a
                    href={asset.href}
                    // Downloads keep their filename; live pages open in a new tab.
                    {...(asset.kind === "download"
                      ? { download: "" }
                      : { target: "_blank", rel: "noreferrer" })}
                    className="group flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3 transition-colors hover:border-primary/60"
                  >
                    {asset.kind === "download" ? (
                      <Download className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
                    )}
                    <span className="font-mono text-sm text-foreground transition-colors group-hover:text-primary">
                      {asset.label}
                    </span>
                    {asset.note && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {asset.note}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Hints, revealed one at a time */}
        {hints.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Hints
            </h2>

            <ul className="space-y-2">
              {hints.slice(0, hintsShown).map((hint, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 rounded-lg border border-yellow-500/25 bg-yellow-500/5 px-4 py-3 text-sm text-muted-foreground"
                >
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                  <span>{hint}</span>
                </motion.li>
              ))}
            </ul>

            {hintsShown < hints.length && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHintsShown((count) => count + 1)}
                className={hintsShown > 0 ? "mt-2" : undefined}
              >
                <Lightbulb />
                {hintsShown === 0
                  ? "Show a hint"
                  : `Show another hint (${hints.length - hintsShown} left)`}
              </Button>
            )}
          </section>
        )}

        {/* Flag submission */}
        <section className="mt-10 rounded-lg border border-border bg-gradient-card p-5">
          <FlagSubmit
            meetingSlug={meeting.slug}
            challengeSlug={challenge.slug}
            flagFormat={challenge.flagFormat}
            alreadySolved={solved.has(challenge.slug)}
            onSolved={() => markSolved(challenge.slug)}
            disabled={isArchived}
          />
          {isArchived && (
            <p className="mt-3 text-sm text-yellow-500">
              This meeting is archived — flags are no longer being scored.
            </p>
          )}
        </section>

        {/* Next challenge */}
        {next && (
          <nav className="mt-8 flex justify-end">
            <Link
              to={`/challenges/${meeting.slug}/${next.slug}`}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Next: {next.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </nav>
        )}
      </article>
    </CtfLayout>
  );
};

export default ChallengePage;
