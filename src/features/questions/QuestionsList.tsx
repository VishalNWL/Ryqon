import QuestionRow from "./QuestionRow";
import type { QuestionWithOptions } from "@/types";
import { FileQuestion } from "lucide-react";

interface QuestionsListProps {
  questions: QuestionWithOptions[];
}

export default function QuestionsList({ questions }: QuestionsListProps) {
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <FileQuestion className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base mb-1">No questions found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or search query to find what you&apos;re
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {questions.map((question, index) => (
        <QuestionRow key={question.id} question={question} index={index} />
      ))}
    </div>
  );
}