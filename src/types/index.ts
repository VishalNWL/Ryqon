// ─── PRISMA BASE TYPES ────────────────────────────────────────────────────
// Defined manually because Prisma v7 doesn't export from @prisma/client directly

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithCount = Category & {
  _count: {
    questions: number;
    papers: number;
  };
};

export type Option = {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
};

export type Question = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  subject: string;
  chapter: string;
  year: number;
  difficulty: Difficulty;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type QuestionWithOptions = Question & {
  options: Option[];
  category: Category;
};

export type Paper = {
  id: string;
  name: string;
  year: number;
  fileUrl: string;
  filePublicId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaperWithCategory = Paper & {
  category: Category;
};

export type UserSolve = {
  id: string;
  userId: string;
  questionId: string;
  isCorrect: boolean;
  createdAt: Date;
};

// ─── FILTER TYPES ─────────────────────────────────────────────────────────

export type QuestionFilter = {
  exam?: string;
  subject?: string;
  chapter?: string;
  year?: number;
  search?: string;
};

export type UserRole = "USER" | "ADMIN";