"use client";

import { useState, useTransition, useRef } from "react";
import { createPaper } from "@/actions/paper";
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
import { Loader2, Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@prisma/client";

interface UploadPaperFormProps {
  categories: Category[];
}

export default function UploadPaperForm({ categories }: UploadPaperFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    publicId: string;
  } | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be less than 20MB");
      return;
    }

    setSelectedFile(file);
    setUploadedFile(null);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Upload failed");
        return;
      }

      setUploadedFile({ url: data.fileUrl, publicId: data.filePublicId });
      toast.success("PDF uploaded successfully");
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (formData: FormData) => {
    if (!uploadedFile) {
      toast.error("Please upload a PDF file first");
      return;
    }

    formData.set("fileUrl", uploadedFile.url);
    formData.set("filePublicId", uploadedFile.publicId);
    formData.set("categoryId", categoryId);

    startTransition(async () => {
      const result = await createPaper(formData);
      if (result.success) {
        toast.success("Paper added successfully");
        formRef.current?.reset();
        setSelectedFile(null);
        setUploadedFile(null);
        setCategoryId("");
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  };

  const isLoading = isPending || isUploading;

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-5">

      {/* Paper Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Paper Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. JEE Main 2023 Paper 1"
          required
          disabled={isLoading}
        />
      </div>

      {/* Category + Year row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Exam Category *</Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            required
            disabled={isLoading}
          >
            <SelectTrigger>
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
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            name="year"
            type="number"
            placeholder="e.g. 2023"
            min={2000}
            max={2030}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>PDF File *</Label>

        {!selectedFile ? (
          <label
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
              "border-border hover:border-indigo-400 hover:bg-indigo-50/30"
            )}
          >
            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              Click to select PDF
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Max 20MB
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <FileText className="w-4.5 h-4.5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Upload to Cloudinary button */}
            {!uploadedFile ? (
              <Button
                type="button"
                size="sm"
                onClick={handleUploadFile}
                disabled={isUploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shrink-0"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            ) : (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                ✓ Uploaded
              </span>
            )}

            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading || !uploadedFile}
        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Save Paper
      </Button>
    </form>
  );
}