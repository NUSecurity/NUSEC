import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import { getMeeting } from "@/ctf/meetings";
import { useProgress } from "@/ctf/progress";
import { categoryLabels } from "@/ctf/types";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/NotFound";

/**
 * /challenges/:meetingSlug — the menu of one meeting's challenges, laid out as
 * a grid in manifest order. Each card carries its own category label, so the
 * grid stays intact rather than being broken up by section headings.
 */
const MeetingPage = () => {
  const { meetingSlug } = useParams();
  const meeting = getMeeting(meetingSlug);

  // Hook order stays stable because useProgress runs before the early return.
  const { solved } = useProgress(meetingSlug ?? "");

  if (!meeting) return <NotFound />;

  const solvedCount = meeting.challenges.filter((challenge) =>
    solved.has(challenge.slug),
  ).length;

  return (
    <CtfLayout wide>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            {meeting.title}
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {solvedCount} of {meeting.challenges.length} solved
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meeting.challenges.map((challenge) => {
          const isSolved = solved.has(challenge.slug);

          return (
            <Link
              key={challenge.slug}
              to={`/challenges/${meeting.slug}/${challenge.slug}`}
              className={cn(
                "flex min-h-[9rem] flex-col justify-between rounded-lg border p-5 transition-colors",
                isSolved
                  ? "border-green-500/60 bg-green-500/10 hover:bg-green-500/20"
                  : "border-border bg-secondary/40 hover:border-primary/60",
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em]",
                  isSolved ? "text-green-400/80" : "text-muted-foreground",
                )}
              >
                {categoryLabels[challenge.category]}
              </span>

              <span className="mt-6 flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "text-xl font-medium leading-tight",
                    isSolved ? "text-green-400" : "text-foreground",
                  )}
                >
                  {challenge.title}
                </span>

                {isSolved && (
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-400" />
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </CtfLayout>
  );
};

export default MeetingPage;
