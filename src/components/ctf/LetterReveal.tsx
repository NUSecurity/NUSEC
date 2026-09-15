import { cn } from "@/lib/utils";

interface LetterRevealProps {
  /** The letter this solve earned, as issued by the checker. */
  letter: string;
  /** 0-based position of that letter in the word. */
  index: number;
  total: number;
}

/**
 * The slice of the meeting-wide word one solved challenge is worth.
 *
 * Only the earned letter is known here — the rest of the word never reaches
 * the browser, so nobody can assemble it without solving. That is the point:
 * the room has to pool what each person found.
 */
const LetterReveal = ({ letter, index, total }: LetterRevealProps) => (
  <div className="rounded-lg border border-primary/40 bg-primary/5 px-5 py-4">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      Letter {index + 1} of {total}
    </p>

    <p
      className="mt-3 flex flex-wrap gap-x-3 gap-y-2 font-mono text-2xl"
      // Screen readers get the position rather than a row of underscores.
      aria-label={`Letter ${index + 1} of ${total} is ${letter}`}
    >
      {Array.from({ length: total }, (_, position) => (
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
      Take this to the room — the other {total - 1} challenges hold the rest.
    </p>
  </div>
);

export default LetterReveal;
