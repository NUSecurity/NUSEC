import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAG_FORMAT } from "@/ctf/types";
import { cn } from "@/lib/utils";

type Status = "idle" | "checking" | "correct" | "incorrect" | "error";

interface FlagSubmitProps {
  meetingSlug: string;
  challengeSlug: string;
  /** True if this challenge was already solved in a previous visit. */
  alreadySolved: boolean;
  onSolved: () => void;
  /** Closed meetings show the input disabled rather than hiding it. */
  disabled?: boolean;
}

const FlagSubmit = ({
  meetingSlug,
  challengeSlug,
  alreadySolved,
  onSolved,
  disabled = false,
}: FlagSubmitProps) => {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<Status>(alreadySolved ? "correct" : "idle");
  const [errorMessage, setErrorMessage] = useState("");

  const solved = status === "correct";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!flag.trim() || status === "checking" || solved) return;

    setStatus("checking");

    try {
      const response = await fetch("/api/ctfValidator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting: meetingSlug,
          challenge: challengeSlug,
          flag,
        }),
      });

      if (!response.ok) {
        // `npm run dev` serves the SPA only; /api needs `vercel dev` or a deploy.
        throw new Error(
          response.status === 404
            ? "Flag checking isn't running on this server. Start it with `vercel dev`."
            : `Checker returned ${response.status}.`,
        );
      }

      const data: { correct?: boolean } = await response.json();

      if (data.correct) {
        setStatus("correct");
        onSolved();
      } else {
        setStatus("incorrect");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Couldn't reach the flag checker.",
      );
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          aria-label="Flag"
          value={solved ? "" : flag}
          onChange={(event) => {
            setFlag(event.target.value);
            if (status !== "idle" && status !== "checking") setStatus("idle");
          }}
          disabled={disabled || solved || status === "checking"}
          placeholder={solved ? "Solved" : FLAG_FORMAT}
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "flex-1 rounded-md border bg-secondary px-4 py-2 font-mono text-sm text-foreground",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-60",
            solved && "border-green-500/60 text-green-400",
            status === "incorrect" && "border-destructive",
            !solved && status !== "incorrect" && "border-input",
          )}
        />
        <Button
          type="submit"
          disabled={disabled || solved || status === "checking" || !flag.trim()}
          className="bg-gradient-primary text-white hover:bg-primary sm:w-28"
        >
          {status === "checking" ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </div>

      {status === "incorrect" && (
        <p className="text-sm text-destructive">Not quite. Try again.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-yellow-500">{errorMessage}</p>
      )}
    </form>
  );
};

export default FlagSubmit;
