import { ChallengeCategory, ChallengeDifficulty } from "@/ctf/types";
import { cn } from "@/lib/utils";

const categoryLabels: Record<ChallengeCategory, string> = {
  web: "Web",
  forensics: "Forensics",
  network: "Network",
  crypto: "Crypto",
  osint: "OSINT",
  reversing: "Reversing",
  misc: "Misc",
};

const difficultyStyles: Record<ChallengeDifficulty, string> = {
  easy: "border-green-500/40 text-green-400",
  medium: "border-yellow-500/40 text-yellow-400",
  hard: "border-destructive/50 text-destructive",
};

const baseBadge =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide";

export const CategoryBadge = ({
  category,
  className,
}: {
  category: ChallengeCategory;
  className?: string;
}) => (
  <span className={cn(baseBadge, "border-primary/40 text-primary", className)}>
    {categoryLabels[category]}
  </span>
);

export const DifficultyBadge = ({
  difficulty,
  className,
}: {
  difficulty: ChallengeDifficulty;
  className?: string;
}) => (
  <span className={cn(baseBadge, difficultyStyles[difficulty], className)}>
    {difficulty}
  </span>
);
