import { getAdminStats } from "@/actions/question";
import { FileQuestion, Tags, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DifficultyBadge from "@/components/shared/DifficultyBadge";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";

export default async function AdminDashboard() {
  // DEBUG — remove after fixing
  const user = await currentUser();
  console.log("CURRENT USER EMAIL:", user?.emailAddresses[0]?.emailAddress);
  console.log("CURRENT USER ID:", user?.id);

  const admin = await isAdmin();
  console.log("IS ADMIN:", admin);
  // END DEBUG


  const result = await getAdminStats();
  const stats = result.data;

  const statCards = [
    {
      label: "Total Questions",
      value: stats?.totalQuestions ?? 0,
      icon: FileQuestion,
      color: "text-indigo-600 bg-indigo-50",
      href: "/admin/questions",
    },
    {
      label: "Categories",
      value: stats?.totalCategories ?? 0,
      icon: Tags,
      color: "text-emerald-600 bg-emerald-50",
      href: "/admin/categories",
    },
    {
      label: "PYQ Papers",
      value: stats?.totalPapers ?? 0,
      icon: FileText,
      color: "text-orange-600 bg-orange-50",
      href: "/admin/papers",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your PYQ platform content
          </p>
        </div>
        <Link href="/admin/questions/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="rounded-xl border border-border p-5 hover:shadow-md transition-shadow bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-lg ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base">Recently Added Questions</h2>
          <Link href="/admin/questions">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          {!stats?.recentQuestions?.length ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No questions yet.{" "}
              <Link href="/admin/questions/new" className="text-indigo-600 hover:underline">
                Add your first question
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {stats.recentQuestions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{q.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {q.subject} · {q.chapter} · {q.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {q.category.name}
                    </span>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}