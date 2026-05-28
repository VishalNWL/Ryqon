"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { QuestionFilter } from "@/types";

export async function getQuestions(filters: QuestionFilter = {}) {
  try {
    const { exam, subject, chapter, year, search } = filters;

    const questions = await prisma.question.findMany({
      where: {
        ...(exam && {
          category: { slug: exam.toLowerCase() },
        }),
        ...(subject && { subject }),
        ...(chapter && { chapter }),
        ...(year && { year: Number(year) }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { subject: { contains: search, mode: "insensitive" } },
            { chapter: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        category: true,
        options: true,
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });

    return { success: true, data: questions };
  } catch (error) {
    console.error("getQuestions error:", error);
    return { success: false, data: [], error: "Failed to fetch questions" };
  }
}

export async function getQuestionById(id: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        category: true,
        options: true,
      },
    });

    if (!question) return { success: false, error: "Question not found" };
    return { success: true, data: question };
  } catch (error) {
    console.error("getQuestionById error:", error);
    return { success: false, error: "Failed to fetch question" };
  }
}

export async function getFilterOptions() {
  try {
    const [categories, subjects, chapters, years] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.question.findMany({
        select: { subject: true },
        distinct: ["subject"],
        orderBy: { subject: "asc" },
      }),
      prisma.question.findMany({
        select: { chapter: true },
        distinct: ["chapter"],
        orderBy: { chapter: "asc" },
      }),
      prisma.question.findMany({
        select: { year: true },
        distinct: ["year"],
        orderBy: { year: "desc" },
      }),
    ]);

    return {
      success: true,
      data: {
        categories,
        subjects: subjects.map((q) => q.subject),
        chapters: chapters.map((q) => q.chapter),
        years: years.map((q) => q.year),
      },
    };
  } catch (error) {
    console.error("getFilterOptions error:", error);
    return {
      success: false,
      data: { categories: [], subjects: [], chapters: [], years: [] },
    };
  }
}

export async function createQuestion(formData: FormData) {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;
    const chapter = formData.get("chapter") as string;
    const year = formData.get("year") as string;
    const difficulty = formData.get("difficulty") as string;
    const categoryId = formData.get("categoryId") as string;
    const correctAnswer = formData.get("correctAnswer") as string;
    const optionA = formData.get("optionA") as string;
    const optionB = formData.get("optionB") as string;
    const optionC = formData.get("optionC") as string;
    const optionD = formData.get("optionD") as string;

    if (!title || !description || !subject || !chapter || !year || !categoryId) {
      return { success: false, error: "All fields are required" };
    }

    const question = await prisma.question.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        chapter: chapter.trim(),
        year: Number(year),
        difficulty: difficulty as any,
        categoryId,
        options: {
          create: [
            { label: "A", text: optionA.trim(), isCorrect: correctAnswer === "A" },
            { label: "B", text: optionB.trim(), isCorrect: correctAnswer === "B" },
            { label: "C", text: optionC.trim(), isCorrect: correctAnswer === "C" },
            { label: "D", text: optionD.trim(), isCorrect: correctAnswer === "D" },
          ],
        },
      },
    });

    revalidatePath("/admin/questions");
    revalidatePath("/questions");
    return { success: true, data: question };
  } catch (error) {
    console.error("createQuestion error:", error);
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateQuestion(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;
    const chapter = formData.get("chapter") as string;
    const year = formData.get("year") as string;
    const difficulty = formData.get("difficulty") as string;
    const categoryId = formData.get("categoryId") as string;
    const correctAnswer = formData.get("correctAnswer") as string;
    const optionA = formData.get("optionA") as string;
    const optionB = formData.get("optionB") as string;
    const optionC = formData.get("optionC") as string;
    const optionD = formData.get("optionD") as string;

    // Delete old options and recreate
    await prisma.option.deleteMany({ where: { questionId: id } });

    const question = await prisma.question.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        chapter: chapter.trim(),
        year: Number(year),
        difficulty: difficulty as any,
        categoryId,
        options: {
          create: [
            { label: "A", text: optionA.trim(), isCorrect: correctAnswer === "A" },
            { label: "B", text: optionB.trim(), isCorrect: correctAnswer === "B" },
            { label: "C", text: optionC.trim(), isCorrect: correctAnswer === "C" },
            { label: "D", text: optionD.trim(), isCorrect: correctAnswer === "D" },
          ],
        },
      },
    });

    revalidatePath("/admin/questions");
    revalidatePath("/questions");
    revalidatePath(`/questions/${id}`);
    return { success: true, data: question };
  } catch (error) {
    console.error("updateQuestion error:", error);
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteQuestion(id: string) {
  try {
    await requireAdmin();
    await prisma.question.delete({ where: { id } });
    revalidatePath("/admin/questions");
    revalidatePath("/questions");
    return { success: true };
  } catch (error) {
    console.error("deleteQuestion error:", error);
    return { success: false, error: "Failed to delete question" };
  }
}

export async function getAdminStats() {
  try {
    await requireAdmin();

    const [totalQuestions, totalCategories, totalPapers, recentQuestions] =
      await Promise.all([
        prisma.question.count(),
        prisma.category.count(),
        prisma.paper.count(),
        prisma.question.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { category: true },
        }),
      ]);

    return {
      success: true,
      data: { totalQuestions, totalCategories, totalPapers, recentQuestions },
    };
  } catch (error) {
    console.error("getAdminStats error:", error);
    return { success: false, data: null, error: "Failed to fetch stats" };
  }
}