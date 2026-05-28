import type { Question, Option, Category, Paper } from "@prisma/client";

export type QuestionWithOptions = Question & {
  options: Option[];
  category: Category;
};

export type PaperWithCategory = Paper & {
  category: Category;
};

export type QuestionFilter = {
  exam?: string;
  subject?: string;
  chapter?: string;
  year?: number;
  search?: string;
};

export type UserRole = "USER" | "ADMIN";