import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ProfileHeatmap from "@/features/profile/ProfileHeatmap";
import SolvedQuestionsList from "@/features/profile/SolvedQuestionsList";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile — PYQLab",
  description: "Track your solved questions and practice activity.",
};

const PAGE_SIZE = 10;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

interface ProfilePageProps {
  searchParams: Promise<{
    page?: string | string[];
  }>;
}

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps) {
  const [{ userId }, params] = await Promise.all([auth(), searchParams]);

  if (!userId) {
    redirect("/login");
  }

  const requestedPageValue = Array.isArray(params.page)
    ? params.page[0]
    : params.page;
  const requestedPage = Number(requestedPageValue);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const activityStart = new Date(todayUtc - 364 * DAY_IN_MILLISECONDS);
  const activityEnd = new Date(todayUtc + DAY_IN_MILLISECONDS);

  const [user, totalSolved] = await Promise.all([
    currentUser(),
    prisma.userSolve.count({
      where: { userId, isCorrect: true },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(totalSolved / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const [activityRecords, solvedQuestions] = await Promise.all([
    prisma.userSolve.findMany({
      where: {
        userId,
        isCorrect: true,
        createdAt: { gte: activityStart, lt: activityEnd },
      },
      select: { createdAt: true },
    }),
    prisma.userSolve.findMany({
      where: { userId, isCorrect: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        question: {
          select: {
            id: true,
            title: true,
            subject: true,
            chapter: true,
            year: true,
            difficulty: true,
            category: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const activityCounts = new Map<string, number>();
  for (const record of activityRecords) {
    const date = record.createdAt.toISOString().slice(0, 10);
    activityCounts.set(date, (activityCounts.get(date) ?? 0) + 1);
  }

  const displayName =
    user?.fullName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress ?? "Learner";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
            {initials || <UserRound className="h-6 w-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold">{displayName}</h1>
            {user?.primaryEmailAddress?.emailAddress && (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {user.primaryEmailAddress.emailAddress}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {totalSolved} solved
          </div>
        </section>

        <ProfileHeatmap
          activityCounts={Array.from(activityCounts, ([date, count]) => ({
            date,
            count,
          }))}
        />

        <SolvedQuestionsList
          questions={solvedQuestions}
          currentPage={currentPage}
          pageCount={pageCount}
          totalSolved={totalSolved}
          pageSize={PAGE_SIZE}
        />
      </main>
    </div>
  );
}
