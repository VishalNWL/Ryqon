"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importQuestions } from "@/actions/question";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUp, Loader2 } from "lucide-react";

export default function ImportQuestionsForm() {
  const [isPending, startTransition] = useTransition();
  const [rowErrors, setRowErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        const result = await importQuestions(formData);
        if (result.success) {
          toast.success(`${result.importedCount} questions imported successfully`);
          setRowErrors([]);
          form.reset();
          router.refresh();
        } else {
          toast.error(result.error);
          setRowErrors(result.rowErrors ?? []);
        }
      } catch {
        toast.error("Could not import the CSV. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="question-csv" className="text-sm font-medium">
            CSV file
          </label>
          <input
            id="question-csv"
            name="file"
            type="file"
            accept=".csv,text/csv"
            required
            disabled={isPending}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm"
          />
          <p className="text-xs text-muted-foreground">
            CSV only, up to 500 KB and 200 questions per import.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileUp className="h-4 w-4" />
          )}
          {isPending ? "Importing..." : "Import Questions"}
        </Button>
      </form>

      {rowErrors.length > 0 && (
        <div
          role="alert"
          className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <p className="mb-2 font-semibold">Fix these CSV rows and try again:</p>
          {rowErrors.map((error, index) => (
            <p key={`${index}-${error}`}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
