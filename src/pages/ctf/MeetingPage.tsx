import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import { getMeeting } from "@/ctf/meetings";
import { useProgress } from "@/ctf/progress";
import { Challenge, ChallengeCategory, categoryLabels } from "@/ctf/types";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/NotFound";

/**
 * Buckets challenges by category, keeping both the categories and the
 * challenges inside them in the order the manifest lists them.
 */
function groupByCategory(challenges: Challenge[]) {
  const groups = new Map<ChallengeCategory, Challenge[]>();

  for (const challenge of challenges) {
    const existing = groups.get(challenge.category);
    if (existing) existing.push(challenge);
    else groups.set(challenge.category, [challenge]);
  }

  return [...groups];
}

/** /challenges/:meetingSlug — the menu of one meeting's challenges. */
const MeetingPage = () => {
  const { meetingSlug } = useParams();
  const meeting = getMeeting(meetingSlug);

  // Hook order stays stable because useProgress runs before the early return.
  const { solved } = useProgress(meetingSlug ?? "");

  if (!meeting) return <NotFound />;

  return (
    <CtfLayout>
      <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          {meeting.title}
        </span>
      </h1>

      <div className="space-y-8">
        {groupByCategory(meeting.challenges).map(([category, challenges]) => (
          <section key={category}>
            <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {categoryLabels[category]}
            </h2>

            <div className="space-y-3">
              {challenges.map((challenge) => {
                const isSolved = solved.has(challenge.slug);

                return (
                  <Link
                    key={challenge.slug}
                    to={`/challenges/${meeting.slug}/${challenge.slug}`}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-5 py-4 text-lg font-medium transition-colors",
                      isSolved
                        ? "border-green-500/60 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "border-border bg-secondary/40 text-foreground hover:border-primary/60 hover:text-primary",
                    )}
                  >
                    {challenge.title}
                    {isSolved && <Check className="h-5 w-5" />}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </CtfLayout>
  );
};

export default MeetingPage;
