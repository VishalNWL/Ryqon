"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { QuestionFilter } from "@/types";

const QUESTION_IMPORT_HEADERS = [
  "title",
  "description",
  "subject",
  "chapter",
  "year",
  "difficulty",
  "category",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctAnswer",
];
const MAX_IMPORT_FILE_SIZE = 500 * 1024;
const MAX_IMPORT_ROWS = 200;

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let afterQuote = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (inQuotes) {
      if (character === '"' && nextCharacter === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
        afterQuote = true;
      } else {
        field += character;
      }
      continue;
    }

    if (
      afterQuote &&
      character !== "," &&
      character !== "\r" &&
      character !== "\n" &&
      character !== " "
    ) {
      throw new Error("Unexpected character after a quoted CSV value.");
    }

    if (character === '"' && field.length === 0 && !afterQuote) {
      inQuotes = true;
    } else if (character === '"') {
      throw new Error("A quote in a CSV value must be escaped or enclose the entire value.");
    } else if (character === ",") {
      row.push(field.trim());
      field = "";
      afterQuote = false;
    } else if (character === "\r" || character === "\n") {
      row.push(field.trim());
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
      afterQuote = false;
      if (character === "\r" && nextCharacter === "\n") index += 1;
    } else if (!afterQuote) {
      field += character;
    }
  }

  if (inQuotes) {
    throw new Error("A quoted CSV value was not closed.");
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((value) => value.length > 0)) rows.push(row);
  }

  return rows;
}

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

export async function importQuestions(formData: FormData) {
  try {
    await requireAdmin();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Choose a CSV file to import." };
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return { success: false, error: "The selected file must be a CSV." };
    }
    if (file.size > MAX_IMPORT_FILE_SIZE) {
      return { success: false, error: "CSV files must be 500 KB or smaller." };
    }

    const content = (await file.text()).replace(/^\uFEFF/, "");
    let rows: string[][];
    try {
      rows = parseCsv(content);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "The CSV format is invalid.",
      };
    }

    if (rows.length < 2) {
      return {
        success: false,
        error: "The CSV must include a header and at least one question.",
      };
    }

    const headers = rows[0].map((header) => header.toLowerCase());
    if (
      headers.length !== QUESTION_IMPORT_HEADERS.length ||
      !QUESTION_IMPORT_HEADERS.every((header, index) => headers[index] === header.toLowerCase())
    ) {
      return {
        success: false,
        error: `CSV headers must be: ${QUESTION_IMPORT_HEADERS.join(", ")}`,
      };
    }

    const dataRows = rows.slice(1);
    if (dataRows.length > MAX_IMPORT_ROWS) {
      return {
        success: false,
        error: `A maximum of ${MAX_IMPORT_ROWS} questions can be imported at once.`,
      };
    }

    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    });
    const categoryIds = new Map<string, string>();
    for (const category of categories) {
      categoryIds.set(category.name.trim().toLowerCase(), category.id);
      categoryIds.set(category.slug.trim().toLowerCase(), category.id);
    }

    const errors: string[] = [];
    const questions = [];

    for (const [index, values] of dataRows.entries()) {
      const rowNumber = index + 2;
      if (values.length !== QUESTION_IMPORT_HEADERS.length) {
        errors.push(
          `Row ${rowNumber}: expected ${QUESTION_IMPORT_HEADERS.length} columns, found ${values.length}.`
        );
        continue;
      }

      const [
        title,
        description,
        subject,
        chapter,
        yearValue,
        difficultyValue,
        categoryValue,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswerValue,
      ] = values;
      const missingFields = [
        ["title", title],
        ["description", description],
        ["subject", subject],
        ["chapter", chapter],
        ["year", yearValue],
        ["difficulty", difficultyValue],
        ["category", categoryValue],
        ["optionA", optionA],
        ["optionB", optionB],
        ["optionC", optionC],
        ["optionD", optionD],
        ["correctAnswer", correctAnswerValue],
      ]
        .filter(([, value]) => !value)
        .map(([name]) => name);

      const rowErrors: string[] = [];
      if (missingFields.length > 0) {
        rowErrors.push(`missing ${missingFields.join(", ")}`);
      }

      const year = Number(yearValue);
      if (yearValue && (!Number.isInteger(year) || year < 1900 || year > 2100)) {
        rowErrors.push("year must be a whole number from 1900 to 2100");
      }

      const difficulty = difficultyValue.toUpperCase();
      if (difficultyValue && !["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
        rowErrors.push("difficulty must be EASY, MEDIUM, or HARD");
      }

      const correctAnswer = correctAnswerValue.toUpperCase();
      if (correctAnswerValue && !["A", "B", "C", "D"].includes(correctAnswer)) {
        rowErrors.push("correctAnswer must be A, B, C, or D");
      }

      const categoryId = categoryIds.get(categoryValue.toLowerCase());
      if (categoryValue && !categoryId) {
        rowErrors.push(
          `category "${categoryValue}" does not match an existing category name or slug`
        );
      }

      if (rowErrors.length > 0) {
        errors.push(`Row ${rowNumber}: ${rowErrors.join("; ")}.`);
        continue;
      }
      if (!categoryId) {
        errors.push(`Row ${rowNumber}: category "${categoryValue}" does not match an existing category name or slug.`);
        continue;
      }

      questions.push({
        title,
        description,
        subject,
        chapter,
        year,
        difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
        categoryId,
        options: [optionA, optionB, optionC, optionD].map((text, optionIndex) => ({
          label: String.fromCharCode(65 + optionIndex),
          text,
          isCorrect: correctAnswer === String.fromCharCode(65 + optionIndex),
        })),
      });
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: "No questions were imported. Fix the CSV errors and try again.",
        rowErrors: errors,
      };
    }

    await prisma.$transaction(
      questions.map(({ options, ...question }) =>
        prisma.question.create({
          data: {
            ...question,
            options: { create: options },
          },
        })
      )
    );

    revalidatePath("/admin/questions");
    revalidatePath("/questions");
    return { success: true, importedCount: questions.length };
  } catch (error) {
    console.error("importQuestions error:", error);
    return { success: false, error: "Failed to import questions. No questions were saved." };
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
    subjects: subjects.map((q: { subject: string }) => q.subject),
    chapters: chapters.map((q: { chapter: string }) => q.chapter),
    years: years.map((q: { year: number }) => q.year),
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
    imageUrl: (formData.get("imageUrl") as string) || null,
    imagePublicId: (formData.get("imagePublicId") as string) || null,
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
    imageUrl: (formData.get("imageUrl") as string) || null,
    imagePublicId: (formData.get("imagePublicId") as string) || null,
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