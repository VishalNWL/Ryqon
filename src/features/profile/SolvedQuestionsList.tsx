import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
} from "lucide-react";
import DifficultyBadge from "@/components/shared/DifficultyBadge";

interface SolvedQuestion {
  id: string;
  createdAt: Date;
  question: {
    id: string;
    title: string;
    subject: string;
    chapter: string;
    year: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    category: { name: string };
  };
}

interface SolvedQuestionsListProps {
  questions: SolvedQuestion[];
  currentPage: number;
  pageCount: number;
  totalSolved: number;
  pageSize: number;
}

function pageHref(page: number) {
  return page === 1 ? "/profile" : `/profile?page=${page}`;
}

export default function SolvedQuestionsList({
  questions,
  currentPage,
  pageCount,
  totalSolved,
  pageSize,
}: SolvedQuestionsListProps) {
  const firstResult =
    totalSolved === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastResult = Math.min(currentPage * pageSize, totalSolved);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold">Solved questions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalSolved === 0
              ? "Questions you answer correctly will appear here."
              : `Showing ${firstResult}–${lastResult} of ${totalSolved}`}
          </p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
            <FileQuestion className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No solved questions yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Head to the question bank and solve your first question to start
            building your activity.
          </p>
          <Link
            href="/questions"
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Browse questions
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {questions.map(({ id, createdAt, question }) => (
            <Link
              key={id}
              href={`/questions/${question.id}`}
              className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-center sm:px-6"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium transition-colors group-hover:text-indigo-600">
                    {question.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {question.subject} <span aria-hidden="true">·</span>{" "}
                    {question.chapter} <span aria-hidden="true">·</span>{" "}
                    {question.year}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0">
                <span className="rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {question.category.name}
                </span>
                <DifficultyBadge difficulty={question.difficulty} />
                <time
                  dateTime={createdAt.toISOString()}
                  className="text-xs text-muted-foreground sm:min-w-24 sm:text-right"
                >
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(createdAt)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalSolved > 0 && (
        <nav
          aria-label="Solved questions pagination"
          className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6"
        >
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={pageHref(currentPage - 1)}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-muted-foreground opacity-50">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </span>
            )}
            {currentPage < pageCount ? (
              <Link
                href={pageHref(currentPage + 1)}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-muted-foreground opacity-50">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </nav>
      )}
    </section>
  );
}
