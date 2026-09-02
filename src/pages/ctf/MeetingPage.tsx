import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import { CategoryBadge, DifficultyBadge } from "@/components/ctf/badges";
import { getMeeting } from "@/ctf/meetings";
import { useProgress } from "@/ctf/progress";
import GlitchText from "@/components/animations/GlitchText";
import NotFound from "@/pages/NotFound";

/** /challenges/:meetingSlug — the index of one meeting's challenges. */
const MeetingPage = () => {
  const { meetingSlug } = useParams();
  const meeting = getMeeting(meetingSlug);

  // Hook order stays stable because useProgress runs before the early return.
  const { solved } = useProgress(meetingSlug ?? "");

  if (!meeting) return <NotFound />;

  const isArchived = meeting.active === false;
  const totalPoints = meeting.challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = meeting.challenges
    .filter((c) => solved.has(c.slug))
    .reduce((sum, c) => sum + c.points, 0);

  return (
    <CtfLayout backTo="/" backLabel="Back to nusec.club">
      <header className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {isArchived ? "Archived" : "Mini-CTF"} ·{" "}
          {new Date(`${meeting.date}T00:00:00`).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            <GlitchText text={meeting.title} intensity="low" />
          </span>
        </h1>

        {meeting.subtitle && (
          <p className="mt-2 text-xl text-muted-foreground">{meeting.subtitle}</p>
        )}

        {meeting.intro?.map((paragraph, index) => (
          <p key={index} className="mt-4 leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}

        {isArchived && (
          <p className="mt-4 rounded-md border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-500">
            This meeting has wrapped up. The challenges are here to read, but
            flags are no longer being scored.
          </p>
        )}
      </header>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">
            {solved.size} of {meeting.challenges.length} solved
          </span>
          <span className="font-mono text-primary">
            {earnedPoints} / {totalPoints} pts
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${(solved.size / meeting.challenges.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Challenge list */}
      <ul className="space-y-4">
        {meeting.challenges.map((challenge, index) => {
          const isSolved = solved.has(challenge.slug);

          return (
            <motion.li
              key={challenge.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Link
                to={`/challenges/${meeting.slug}/${challenge.slug}`}
                className="group block rounded-lg border border-border bg-gradient-card p-5 transition-colors hover:border-primary/60"
              >
                <div className="flex items-start gap-4">
                  {isSolved ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                        {challenge.title}
                      </h2>
                      <CategoryBadge category={challenge.category} />
                      <DifficultyBadge difficulty={challenge.difficulty} />
                      <span className="ml-auto font-mono text-sm text-muted-foreground">
                        {challenge.points} pts
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {challenge.tagline}
                    </p>
                  </div>

                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </CtfLayout>
  );
};

export default MeetingPage;
