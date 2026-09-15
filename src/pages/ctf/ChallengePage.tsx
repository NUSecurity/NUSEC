import { useParams } from "react-router-dom";
import { Download, ExternalLink } from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import FlagSubmit from "@/components/ctf/FlagSubmit";
import LetterReveal from "@/components/ctf/LetterReveal";
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
  const entry = solved.get(challenge.slug);
  const isSolved = entry !== undefined;

  return (
    <CtfLayout backTo={`/challenges/${meeting.slug}`}>
      <article>
        <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
          {challenge.title}
        </h1>

        <p className="leading-relaxed text-muted-foreground">
          {challenge.brief}
        </p>

        {challenge.content && (
          <pre className="mt-6 whitespace-pre-wrap break-all rounded-lg border border-border bg-secondary/40 px-4 py-3 font-mono text-sm text-foreground">
            {challenge.content}
          </pre>
        )}

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
            alreadySolved={isSolved}
            onSolved={(award) => markSolved(challenge.slug, award)}
            disabled={isArchived}
          />
          {isArchived && (
            <p className="mt-3 text-sm text-yellow-500">
              This meeting is archived — flags are no longer being scored.
            </p>
          )}
        </div>

        {entry?.letter !== undefined &&
          entry.index !== undefined &&
          entry.total !== undefined && (
            <div className="mt-6">
              <LetterReveal
                letter={entry.letter}
                index={entry.index}
                total={entry.total}
              />
            </div>
          )}
      </article>
    </CtfLayout>
  );
};

export default ChallengePage;
