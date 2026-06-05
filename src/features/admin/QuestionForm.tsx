"use client";

import { useTransition, useState, useRef } from "react";
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
import { Loader2, Save, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
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
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    question?.imageUrl ?? null
  );
  const [imageUrl, setImageUrl] = useState<string>(question?.imageUrl ?? "");
  const [imagePublicId, setImagePublicId] = useState<string>(
    question?.imagePublicId ?? ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isEditing = !!question;

  const getOption = (label: string) =>
    question?.options.find((o) => o.label === label);

  const correctAnswer =
    question?.options.find((o) => o.isCorrect)?.label ?? "A";

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Image upload failed");
        setImagePreview(question?.imageUrl ?? null);
        return;
      }

      setImageUrl(data.imageUrl);
      setImagePublicId(data.imagePublicId);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
      setImagePreview(question?.imageUrl ?? null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageUrl("");
    setImagePublicId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (formData: FormData) => {
    formData.set("imageUrl", imageUrl);
    formData.set("imagePublicId", imagePublicId);

    startTransition(async () => {
      const result = isEditing
        ? await updateQuestion(question.id, formData)
        : await createQuestion(formData);

      if (result.success) {
        toast.success(
          isEditing
            ? "Question updated successfully"
            : "Question created successfully"
        );
        router.push("/admin/questions");
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  };

  const isLoading = isPending || isUploading;

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
          disabled={isLoading}
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
          disabled={isLoading}
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Question Image (Optional)</Label>

        {!imagePreview ? (
          <label
            className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors border-border hover:border-indigo-400 hover:bg-indigo-50/30"
          >
            <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              Click to upload image
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WebP · Max 5MB
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
              disabled={isLoading}
            />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border">
            {/* Preview image — scaled down */}
            <div className="relative w-full h-48 bg-secondary/30">
              <Image
                src={imagePreview}
                alt="Question image preview"
                fill
                className="object-contain p-2"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-2 bg-secondary/30 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {imageUrl ? "✓ Uploaded to Cloudinary" : "Uploading..."}
              </span>
              <div className="flex items-center gap-2">
                {/* Replace image */}
                <label className="cursor-pointer">
                  <span className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Replace
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>
                {/* Remove image */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Row: Category + Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Exam Category *</Label>
          <Select
            name="categoryId"
            defaultValue={question?.categoryId}
            required
          >
            <SelectTrigger disabled={isLoading}>
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
            <SelectTrigger disabled={isLoading}>
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
            disabled={isLoading}
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
            disabled={isLoading}
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
          disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        ))}
      </div>

      {/* Correct Answer */}
      <div className="space-y-2">
        <Label>Correct Answer *</Label>
        <Select name="correctAnswer" defaultValue={correctAnswer}>
          <SelectTrigger disabled={isLoading}>
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
          disabled={isLoading}
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
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}