import { getCategories } from "@/actions/category";
import QuestionForm from "@/features/admin/QuestionForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewQuestionPage() {
  const { data: categories } = await getCategories();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/questions">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add Question</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create a new PYQ question
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border p-6 bg-card">
        <QuestionForm categories={categories as any} />
      </div>
    </div>
  );
}