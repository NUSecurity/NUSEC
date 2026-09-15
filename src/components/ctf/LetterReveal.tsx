import { cn } from "@/lib/utils";

interface LetterRevealProps {
  word: string;
  /** Position in the word this challenge is worth, 0-based. */
  index: number;
}

/**
 * The slice of the meeting-wide word one solved challenge is worth.
 *
 * Only this challenge's letter is shown — nobody can assemble the word alone,
 * which is the point: the room has to pool what each person found.
 */
const LetterReveal = ({ word, index }: LetterRevealProps) => {
  const letters = [...word];

  return (
    <div className="rounded-lg border border-primary/40 bg-primary/5 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Letter {index + 1} of {letters.length}
      </p>

      <p
        className="mt-3 flex flex-wrap gap-x-3 gap-y-2 font-mono text-2xl"
        // Screen readers get the position rather than a row of underscores.
        aria-label={`Letter ${index + 1} of ${letters.length} is ${letters[index]}`}
      >
        {letters.map((letter, position) => (
          <span
            key={position}
            aria-hidden="true"
            className={cn(
              "w-5 text-center",
              position === index
                ? "font-bold text-primary"
                : "text-muted-foreground/40",
            )}
          >
            {position === index ? letter : "_"}
          </span>
        ))}
      </p>

      <p className="mt-3 text-sm text-muted-foreground">
        Take this to the room — the other eight challenges hold the rest.
      </p>
    </div>
  );
};

export default LetterReveal;
