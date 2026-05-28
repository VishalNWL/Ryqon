"use client";

import { useTransition } from "react";
import { deletePaper } from "@/actions/paper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function DeletePaperButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this paper? This will also remove it from Cloudinary."))
      return;

    startTransition(async () => {
      const result = await deletePaper(id);
      if (result.success) {
        toast.success("Paper deleted");
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
      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}