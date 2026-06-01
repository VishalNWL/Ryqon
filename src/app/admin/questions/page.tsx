import Link from "next/link";
import { getQuestions } from "@/actions/question";
import { Button } from "@/components/ui/button";
import DifficultyBadge from "@/components/shared/DifficultyBadge";
import DeleteQuestionButton from "@/features/admin/DeleteQuestionButton";
import { Plus, Pencil } from "lucide-react";

type QuestionItem = {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  year: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: { name: string };
};

export default async function AdminQuestionsPage() {
  const { data: questions } = await getQuestions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Questions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {questions.length} questions total
          </p>
        </div>
        <Link href="/admin/questions/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_120px_100px_90px_80px] gap-4 px-4 py-3 bg-secondary/50 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Question</span>
          <span>Subject</span>
          <span>Category</span>
          <span>Difficulty</span>
          <span className="text-right">Actions</span>
        </div>

        {questions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              No questions yet.
            </p>
            <Link href="/admin/questions/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Add First Question
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(questions as QuestionItem[]).map((q) => (
              <div
                key={q.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_90px_80px] gap-2 sm:gap-4 px-4 py-3 items-center hover:bg-secondary/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{q.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {q.chapter} · {q.year}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground truncate">
                  {q.subject}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 w-fit">
                  {q.category.name}
                </span>
                <DifficultyBadge difficulty={q.difficulty} />
                <div className="flex items-center gap-1 sm:justify-end">
                  <Link href={`/admin/questions/${q.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <DeleteQuestionButton id={q.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}