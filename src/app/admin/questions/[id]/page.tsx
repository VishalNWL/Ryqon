import { notFound } from "next/navigation";
import { getQuestionById } from "@/actions/question";
import { getCategories } from "@/actions/category";
import QuestionForm from "@/features/admin/QuestionForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { id } = await params;
  const [questionResult, categoriesResult] = await Promise.all([
    getQuestionById(id),
    getCategories(),
  ]);

  if (!questionResult.success || !questionResult.data) {
    notFound();
  }

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
          <h1 className="text-2xl font-bold">Edit Question</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update question details
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border p-6 bg-card">
        <QuestionForm
          categories={categoriesResult.data as any}
          question={questionResult.data as any}
        />
      </div>
    </div>
  );
}