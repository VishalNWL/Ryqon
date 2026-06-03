"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuestion, updateQuestion } from "@/actions/question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import type { Category, Question, Option } from "@/types";

interface QuestionFormProps {
  categories: Category[];
  question?: Question & { options: Option[] };
}

export default function QuestionForm({
  categories,
  question,
}: QuestionFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditing = !!question;

  const getOption = (label: string) =>
    question?.options.find((o) => o.label === label);

  const correctAnswer = question?.options.find((o) => o.isCorrect)?.label ?? "A";

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isEditing
        ? await updateQuestion(question.id, formData)
        : await createQuestion(formData);

      if (result.success) {
        toast.success(
          isEditing ? "Question updated successfully" : "Question created successfully"
        );
        router.push("/admin/questions");
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Question Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter question title"
          defaultValue={question?.title}
          required
          disabled={isPending}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          name="description"
          placeholder="Full question text or problem statement..."
          defaultValue={question?.description}
          required
          disabled={isPending}
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {/* Row: Category + Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Exam Category *</Label>
          <Select name="categoryId" defaultValue={question?.categoryId} required>
            <SelectTrigger disabled={isPending}>
              <SelectValue placeholder="Select exam" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Difficulty *</Label>
          <Select
            name="difficulty"
            defaultValue={question?.difficulty ?? "MEDIUM"}
          >
            <SelectTrigger disabled={isPending}>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row: Subject + Chapter */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="e.g. Physics"
            defaultValue={question?.subject}
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chapter">Chapter *</Label>
          <Input
            id="chapter"
            name="chapter"
            placeholder="e.g. Kinematics"
            defaultValue={question?.chapter}
            required
            disabled={isPending}
          />
        </div>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label htmlFor="year">Year *</Label>
        <Input
          id="year"
          name="year"
          type="number"
          placeholder="e.g. 2023"
          defaultValue={question?.year}
          min={2000}
          max={2030}
          required
          disabled={isPending}
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <Label>Answer Options *</Label>
        {["A", "B", "C", "D"].map((label) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
              {label}
            </span>
            <Input
              name={`option${label}`}
              placeholder={`Option ${label}`}
              defaultValue={getOption(label)?.text}
              required
              disabled={isPending}
            />
          </div>
        ))}
      </div>

      {/* Correct Answer */}
      <div className="space-y-2">
        <Label>Correct Answer *</Label>
        <Select name="correctAnswer" defaultValue={correctAnswer}>
          <SelectTrigger disabled={isPending}>
            <SelectValue placeholder="Select correct option" />
          </SelectTrigger>
          <SelectContent>
            {["A", "B", "C", "D"].map((label) => (
              <SelectItem key={label} value={label}>
                Option {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEditing ? "Update Question" : "Create Question"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/questions")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}