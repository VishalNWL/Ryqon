import Link from "next/link";
import { cn } from "@/lib/utils";
import DifficultyBadge from "@/components/shared/DifficultyBadge";
import type { QuestionWithOptions } from "@/types";
import { BookOpen, Calendar, Tag } from "lucide-react";

interface QuestionRowProps {
  question: QuestionWithOptions;
  index: number;
}

export default function QuestionRow({ question, index }: QuestionRowProps) {
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
        {/* Index */}
        <span className="hidden sm:block w-10 text-sm text-muted-foreground text-center shrink-0">
          {index + 1}
        </span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground group-hover:text-indigo-600 transition-colors truncate">
            {question.title}
          </p>
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
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {question.category.name}
          </span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
      </div>
    </Link>
  );
}