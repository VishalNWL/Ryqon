"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function saveUserSolve(questionId: string, isCorrect: boolean) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Not authenticated" };

    // upsert — update if already solved, create if not
    await prisma.userSolve.upsert({
      where: { userId_questionId: { userId, questionId } },
      update: isCorrect
        ? { isCorrect: true, createdAt: new Date() }
        : { isCorrect: false },
      create: { userId, questionId, isCorrect },
    });

    return { success: true };
  } catch (error) {
    console.error("saveUserSolve error:", error);
    return { success: false, error: "Failed to save" };
  }
}

export async function getUserSolves() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: true, data: [] };

    const solves = await prisma.userSolve.findMany({
      where: { userId },
      select: { questionId: true, isCorrect: true },
    });

    return { success: true, data: solves };
  } catch (error) {
    console.error("getUserSolves error:", error);
    return { success: true, data: [] };
  }
}