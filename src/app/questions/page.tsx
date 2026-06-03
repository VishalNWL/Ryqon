import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import QuestionFilters from "@/features/questions/QuestionFilters";
import QuestionsList from "@/features/questions/QuestionsList";
import QuestionsSkeleton from "@/features/questions/QuestionsSkeleton";
import { getQuestions, getFilterOptions } from "@/actions/question";
import { getUserSolves } from "@/actions/solve";
import type { QuestionFilter } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Questions — PYQLab",
  description:
    "Practice 10,000+ JEE and NEET previous year questions with filters by subject, chapter and year.",
};

interface QuestionsPageProps {
  searchParams: Promise<{
    exam?: string;
    subject?: string;
    chapter?: string;
    year?: string;
    search?: string;
  }>;
}

async function QuestionsContent({ filters }: { filters: QuestionFilter }) {
  const [{ data: questions }, { data: solvesData }] = await Promise.all([
    getQuestions(filters),
    getUserSolves(),
  ]);

  const solves = (solvesData ?? []) as { questionId: string; isCorrect: boolean }[];

  const solveMap: Record<string, { isCorrect: boolean }> = {};
  for (const solve of solves) {
    solveMap[solve.questionId] = { isCorrect: solve.isCorrect };
  }

  return <QuestionsList questions={questions as any} solveMap={solveMap} />;
}


export default async function QuestionsPage({
  searchParams,
}: QuestionsPageProps) {
  const params = await searchParams;

  const filters: QuestionFilter = {
    exam: params.exam,
    subject: params.subject,
    chapter: params.chapter,
    year: params.year ? Number(params.year) : undefined,
    search: params.search,
  };

  const { data: filterOptions } = await getFilterOptions();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Previous Year Questions</h1>
          <p className="text-muted-foreground text-sm">
            Practice questions from JEE and NEET previous year papers
          </p>
        </div>

        <div className="mb-6">
          <QuestionFilters
            categories={filterOptions?.categories ?? []}
            subjects={filterOptions?.subjects ?? []}
            chapters={filterOptions?.chapters ?? []}
            years={filterOptions?.years ?? []}
          />
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="hidden sm:flex items-center gap-3 px-4 py-3 bg-secondary/50 border-b border-border">
            <span className="w-10 text-xs font-medium text-muted-foreground text-center">
              #
            </span>
            <span className="flex-1 text-xs font-medium text-muted-foreground">
              Question
            </span>
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              Status / Difficulty
            </span>
          </div>

          <Suspense fallback={<QuestionsSkeleton />}>
            <QuestionsContent filters={filters} />
          </Suspense>
        </div>

      </div>
    </div>
  );
}