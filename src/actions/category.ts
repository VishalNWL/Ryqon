"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { questions: true, papers: true } },
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("getCategories error:", error);
    return { success: false, data: [], error: "Failed to fetch categories" };
  }
}

export async function createCategory(formData: FormData) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name?.trim()) {
      return { success: false, error: "Category name is required" };
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Category already exists" };
    }

    const category = await prisma.category.create({
      data: { name: name.trim(), slug, description: description?.trim() || null },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/questions");
    return { success: true, data: category };
  } catch (error) {
    console.error("createCategory error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdmin();

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/questions");
    return { success: true };
  } catch (error) {
    console.error("deleteCategory error:", error);
    return { success: false, error: "Failed to delete category" };
  }
}