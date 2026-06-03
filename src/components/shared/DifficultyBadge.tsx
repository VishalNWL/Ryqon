import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const config = {
  EASY: {
    label: "Easy",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  MEDIUM: {
    label: "Medium",
    className: "text-yellow-700 bg-yellow-50 border-yellow-200",
  },
  HARD: {
    label: "Hard",
    className: "text-rose-700 bg-rose-50 border-rose-200",
  },
};

export default function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  const { label, className: colorClass } = config[difficulty];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}