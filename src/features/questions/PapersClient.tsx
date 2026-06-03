"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PaperWithCategory } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface PapersClientProps {
  papers: PaperWithCategory[];
  categories: Category[];
}

export default function PapersClient({
  papers,
  categories,
}: PapersClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = papers.filter((paper) => {
    const matchesCategory =
      activeCategory === "all" || paper.category.slug === activeCategory;
    const matchesSearch =
      !search ||
      paper.name.toLowerCase().includes(search.toLowerCase()) ||
      String(paper.year).includes(search);
    return matchesCategory && matchesSearch;
  });

  // Group by year
  const groupedByYear = filtered.reduce(
    (acc, paper) => {
      const year = String(paper.year);
      if (!acc[year]) acc[year] = [];
      acc[year].push(paper);
      return acc;
    },
    {} as Record<string, PaperWithCategory[]>
  );

  const sortedYears = Object.keys(groupedByYear).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeCategory === "all"
                ? "bg-indigo-600 text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === cat.slug
                  ? "bg-indigo-600 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search papers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Papers grouped by year */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No papers found</h3>
          <p className="text-sm text-muted-foreground">
            Try a different filter or search term.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year}>
              {/* Year heading */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold">{year}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {groupedByYear[year].length} paper
                  {groupedByYear[year].length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Paper cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedByYear[year].map((paper) => (
                  <div
                    key={paper.id}
                    className="group flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug">
                          {paper.name}
                        </p>
                        <span className="inline-flex mt-1.5 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {paper.category.name}
                        </span>
                      </div>
                    </div>

                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}