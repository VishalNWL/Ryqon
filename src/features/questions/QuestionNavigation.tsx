import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutList } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface QuestionNavigationProps {
  currentId: string;
  categoryId: string;
}

export default async function QuestionNavigation({
  currentId,
  categoryId,
}: QuestionNavigationProps) {
  // Get all question IDs in same category ordered by year desc
  const questions = await prisma.question.findMany({
    where: { categoryId },
    select: { id: true },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  const currentIndex = questions.findIndex((q) => q.id === currentId);
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div>
        {prevQuestion ? (
          <Link href={`/questions/${prevQuestion.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled className="gap-1.5">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
        )}
      </div>

      <Link href="/questions">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <LayoutList className="w-4 h-4" />
          All Questions
        </Button>
      </Link>

      <div>
        {nextQuestion ? (
          <Link href={`/questions/${nextQuestion.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled className="gap-1.5">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}