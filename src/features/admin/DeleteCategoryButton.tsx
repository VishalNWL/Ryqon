"use client";

import { useTransition } from "react";
import { deleteCategory } from "@/actions/category";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export default function DeleteCategoryButton({
  id,
  name,
}: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !confirm(
        `Delete "${name}"? This will also delete all questions and papers in this category.`
      )
    )
      return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success("Category deleted");
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}