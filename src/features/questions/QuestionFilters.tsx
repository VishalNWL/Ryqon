"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { Category } from "@/types"

interface QuestionFiltersProps {
  categories: Category[];
  subjects: string[];
  chapters: string[];
  years: number[];
}

export default function QuestionFilters({
  categories,
  subjects,
  chapters,
  years,
}: QuestionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (key: string, value: string | null) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ [key]: value })}`, {
        scroll: false,
      });
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters =
    searchParams.has("exam") ||
    searchParams.has("subject") ||
    searchParams.has("chapter") ||
    searchParams.has("year") ||
    searchParams.has("search");

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search questions, topics, chapters..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => {
              updateFilter("search", value || null);
            }, 400);
            return () => clearTimeout(timeout);
          }}
          className="pl-9 h-10"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2">
        {/* Exam */}
        <Select
          value={searchParams.get("exam") ?? "all"}
          onValueChange={(val) => updateFilter("exam", val)}
        >
          <SelectTrigger className="w-[130px] h-9 text-sm">
            <SelectValue placeholder="Exam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exams</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subject */}
        <Select
          value={searchParams.get("subject") ?? "all"}
          onValueChange={(val) => updateFilter("subject", val)}
        >
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chapter */}
        <Select
          value={searchParams.get("chapter") ?? "all"}
          onValueChange={(val) => updateFilter("chapter", val)}
        >
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            {chapters.map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={searchParams.get("year") ?? "all"}
          onValueChange={(val) => updateFilter("year", val)}
        >
          <SelectTrigger className="w-[120px] h-9 text-sm">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
            disabled={isPending}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}