"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function getPapers(categorySlug?: string) {
  try {
    const papers = await prisma.paper.findMany({
      where: {
        ...(categorySlug && {
          category: { slug: categorySlug },
        }),
      },
      include: { category: true },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });
    return { success: true, data: papers };
  } catch (error) {
    console.error("getPapers error:", error);
    return { success: false, data: [], error: "Failed to fetch papers" };
  }
}

export async function createPaper(formData: FormData) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const year = formData.get("year") as string;
    const categoryId = formData.get("categoryId") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const filePublicId = formData.get("filePublicId") as string;

    if (!name || !year || !categoryId || !fileUrl || !filePublicId) {
      return { success: false, error: "All fields are required" };
    }

    const paper = await prisma.paper.create({
      data: {
        name: name.trim(),
        year: Number(year),
        categoryId,
        fileUrl,
        filePublicId,
      },
    });

    revalidatePath("/admin/papers");
    revalidatePath("/papers");
    return { success: true, data: paper };
  } catch (error) {
    console.error("createPaper error:", error);
    return { success: false, error: "Failed to create paper" };
  }
}

export async function deletePaper(id: string) {
  try {
    await requireAdmin();

    const paper = await prisma.paper.findUnique({ where: { id } });
    if (!paper) return { success: false, error: "Paper not found" };

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(paper.filePublicId, {
      resource_type: "raw",
    });

    await prisma.paper.delete({ where: { id } });

    revalidatePath("/admin/papers");
    revalidatePath("/papers");
    return { success: true };
  } catch (error) {
    console.error("deletePaper error:", error);
    return { success: false, error: "Failed to delete paper" };
  }
}