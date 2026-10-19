import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImportQuestionsForm from "@/features/admin/ImportQuestionsForm";

export default function ImportQuestionsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/questions">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Bulk Import Questions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Import multiple questions from a CSV file.
          </p>
        </div>
      </div>

      <section className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Use the template so the column names and order match. Every row
            needs all fields, and its category must match an existing category
            name or slug. Difficulty accepts EASY, MEDIUM, or HARD; the correct
            answer must be A, B, C, or D.
          </p>
          <p>
            Put commas, quotes, or line breaks inside a CSV value in double
            quotes. If any row is invalid, nothing is imported.
          </p>
          <p>Question images are not included in CSV imports.</p>
        </div>

        <a
          href="/question-import-template.csv"
          download
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <Download className="h-4 w-4" />
          Download CSV template
        </a>

        <div className="border-t border-border pt-5">
          <ImportQuestionsForm />
        </div>
      </section>
    </div>
  );
}
