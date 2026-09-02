import { useParams } from "react-router-dom";
import { Download, ExternalLink } from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import FlagSubmit from "@/components/ctf/FlagSubmit";
import { getChallenge } from "@/ctf/meetings";
import { useProgress } from "@/ctf/progress";
import NotFound from "@/pages/NotFound";

/** /challenges/:meetingSlug/:challengeSlug — one challenge's brief and flag box. */
const ChallengePage = () => {
  const { meetingSlug, challengeSlug } = useParams();
  const found = getChallenge(meetingSlug, challengeSlug);

  // Hooks run unconditionally so the early return below is safe.
  const { solved, markSolved } = useProgress(meetingSlug ?? "");

  if (!found) return <NotFound />;

  const { meeting, challenge } = found;
  const isArchived = meeting.active === false;

  return (
    <CtfLayout backTo={`/challenges/${meeting.slug}`}>
      <article>
        <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
          {challenge.title}
        </h1>

        <div className="space-y-4">
          {challenge.brief.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        {challenge.assets && challenge.assets.length > 0 && (
          <ul className="mt-6 space-y-2">
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
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <FlagSubmit
            meetingSlug={meeting.slug}
            challengeSlug={challenge.slug}
            alreadySolved={solved.has(challenge.slug)}
            onSolved={() => markSolved(challenge.slug)}
            disabled={isArchived}
          />
          {isArchived && (
            <p className="mt-3 text-sm text-yellow-500">
              This meeting is archived — flags are no longer being scored.
            </p>
          )}
        </div>
      </article>
    </CtfLayout>
  );
};

export default ChallengePage;
