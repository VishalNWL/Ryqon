import Link from "next/link";
import { cn } from "@/lib/utils";
import DifficultyBadge from "@/components/shared/DifficultyBadge";
import type { QuestionWithOptions } from "@/types";
import { BookOpen, Calendar, Tag, CheckCircle2 } from "lucide-react";

interface QuestionRowProps {
  question: QuestionWithOptions;
  index: number;
  isSolved?: boolean;
  isCorrect?: boolean;
}

export default function QuestionRow({
  question,
  index,
  isSolved,
  isCorrect,
}: QuestionRowProps) {
  return (
    <Link href={`/questions/${question.id}`}>
      <div
        className={cn(
          "group flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 transition-colors cursor-pointer",
          index % 2 === 0
            ? "bg-background hover:bg-secondary/40"
            : "bg-secondary/20 hover:bg-secondary/50"
        )}
      >
        {/* Index or solved icon */}
        <div className="hidden sm:flex w-10 items-center justify-center shrink-0">
          {isSolved ? (
            <CheckCircle2
              className={cn(
                "w-4 h-4",
                isCorrect ? "text-emerald-500" : "text-rose-400"
              )}
            />
          ) : (
            <span className="text-sm text-muted-foreground">{index + 1}</span>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-sm font-medium transition-colors truncate",
                isSolved
                  ? isCorrect
                    ? "text-emerald-700 group-hover:text-emerald-600"
                    : "text-rose-700 group-hover:text-rose-600"
                  : "text-foreground group-hover:text-indigo-600"
              )}
            >
              {question.title}
            </p>
            {/* Mobile solved icon */}
            {isSolved && (
              <CheckCircle2
                className={cn(
                  "sm:hidden w-4 h-4 shrink-0",
                  isCorrect ? "text-emerald-500" : "text-rose-400"
                )}
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              {question.subject}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="w-3 h-3" />
              {question.chapter}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {question.year}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {isSolved && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded border",
                isCorrect
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              )}
            >
              {isCorrect ? "Solved" : "Attempted"}
            </span>
          )}
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {question.category.name}
          </span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
      </div>
    </Link>
  );
}