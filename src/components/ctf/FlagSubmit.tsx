import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Flag, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "checking" | "correct" | "incorrect" | "error";

interface FlagSubmitProps {
  meetingSlug: string;
  challengeSlug: string;
  flagFormat: string;
  /** True if this challenge was already solved in a previous visit. */
  alreadySolved: boolean;
  onSolved: () => void;
  /** Closed meetings show the input disabled rather than hiding it. */
  disabled?: boolean;
}

const FlagSubmit = ({
  meetingSlug,
  challengeSlug,
  flagFormat,
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <label
        htmlFor={`flag-${challengeSlug}`}
        className="flex items-center gap-2 text-sm font-medium text-foreground"
      >
        <Flag className="h-4 w-4 text-primary" />
        Submit flag
        <span className="font-mono text-xs text-muted-foreground">
          {flagFormat}
        </span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`flag-${challengeSlug}`}
          type="text"
          value={solved ? "" : flag}
          onChange={(event) => {
            setFlag(event.target.value);
            if (status !== "idle" && status !== "checking") setStatus("idle");
          }}
          disabled={disabled || solved || status === "checking"}
          placeholder={solved ? "Solved" : flagFormat}
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "flex-1 rounded-md border bg-secondary px-4 py-2 font-mono text-sm text-foreground",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-60",
            status === "correct" && "border-green-500",
            status === "incorrect" && "border-destructive",
            (status === "idle" || status === "checking" || status === "error") &&
              "border-input",
          )}
        />
        <Button
          type="submit"
          disabled={disabled || solved || status === "checking" || !flag.trim()}
          className="bg-gradient-primary text-white hover:bg-primary sm:w-32"
        >
          {status === "checking" ? (
            <>
              <Loader2 className="animate-spin" /> Checking
            </>
          ) : (
            "Check"
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {status === "correct" && (
          <motion.p
            key="correct"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm font-medium text-green-500"
          >
            <CheckCircle2 className="h-4 w-4" />
            Correct — challenge solved.
          </motion.p>
        )}
        {status === "incorrect" && (
          <motion.p
            key="incorrect"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <XCircle className="h-4 w-4" />
            Not quite. Check the format and try again.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-yellow-500"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};

export default FlagSubmit;
