import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/layout/Navbar";
import MCQOptions from "@/features/questions/MCQOptions";
import QuestionTimer from "@/features/questions/QuestionTimer";
import QuestionNavigation from "@/features/questions/QuestionNavigation";
import QuestionSolveSkeleton from "@/features/questions/QuestionSolveSkeleton";
import DifficultyBadge from "@/components/shared/DifficultyBadge";
import { getQuestionById } from "@/actions/question";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Tag } from "lucide-react";
import Image from "next/image";

interface SolvePageProps {
  params: Promise<{ id: string }>;
}

async function QuestionContent({ id }: { id: string }) {
  const result = await getQuestionById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const question = result.data;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Exam badge */}
          <Badge
            variant="outline"
            className="text-xs font-medium border-indigo-200 text-indigo-700 bg-indigo-50"
          >
            {question.category.name}
          </Badge>

          {/* Subject */}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="w-3 h-3" />
            {question.subject}
          </span>

          {/* Chapter */}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Tag className="w-3 h-3" />
            {question.chapter}
          </span>

          {/* Year */}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {question.year}
          </span>

          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        {/* Timer */}
        <QuestionTimer />
      </div>

      {/* Question Card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h1 className="text-lg font-semibold leading-relaxed">
          {question.title}
        </h1>

        {question.description && (
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {question.description}
          </p>
        )}

        {/* Optional image */}
        {question.imageUrl && (
          <div className="relative w-full max-h-64 rounded-lg overflow-hidden border border-border">
            <Image
              src={question.imageUrl}
              alt="Question diagram"
              width={700}
              height={300}
              className="object-contain w-full"
            />
          </div>
        )}
      </div>

      {/* MCQ Options */}
      <MCQOptions options={question.options} questionId={question.id} />

      {/* Navigation */}
      <Suspense fallback={null}>
        <QuestionNavigation
          currentId={question.id}
          categoryId={question.categoryId}
        />
      </Suspense>

    </div>
  );
}

export default async function SolvePage({ params }: SolvePageProps) {
  // Require authentication
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<QuestionSolveSkeleton />}>
          <QuestionContent id={id} />
        </Suspense>
      </div>
    </div>
  );
}