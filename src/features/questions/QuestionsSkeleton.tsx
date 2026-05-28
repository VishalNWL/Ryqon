import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionsSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-4"
        >
          <Skeleton className="hidden sm:block h-4 w-8 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}