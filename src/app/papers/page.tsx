import Navbar from "@/components/layout/Navbar";
import { getPapers } from "@/actions/paper";
import { getCategories } from "@/actions/category";
import PapersClient from "@/features/questions/PapersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PYQ Papers — PYQLab",
  description:
    "Download previous year question papers for JEE and NEET as PDF.",
};

export default async function PapersPage() {
  const [{ data: papers }, { data: categories }] = await Promise.all([
    getPapers(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Previous Year Papers</h1>
          <p className="text-muted-foreground text-sm">
            Download original question papers as PDF
          </p>
        </div>

        <PapersClient
          papers={papers as any}
          categories={categories as any}
        />
      </div>
    </div>
  );
}