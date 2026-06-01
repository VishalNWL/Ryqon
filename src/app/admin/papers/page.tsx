import { getPapers } from "@/actions/paper";
import { getCategories } from "@/actions/category";
import UploadPaperForm from "@/features/admin/UploadPaperForm";
import DeletePaperButton from "@/features/admin/DeletePaperButton";
import { FileText, ExternalLink } from "lucide-react";

type PaperWithCategory = {
  id: string;
  name: string;
  year: number;
  fileUrl: string;
  filePublicId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string };
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default async function AdminPapersPage() {
  const [{ data: papers }, { data: categories }] = await Promise.all([
    getPapers(),
    getCategories(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">PYQ Papers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload and manage previous year question papers
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div>
          <h2 className="font-semibold mb-4">Upload New Paper</h2>
          <div className="rounded-xl border border-border p-5 bg-card">
            <UploadPaperForm categories={categories as CategoryItem[]} />
          </div>
        </div>

        {/* Papers List */}
        <div>
          <h2 className="font-semibold mb-4">
            Uploaded Papers ({papers.length})
          </h2>

          {papers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No papers uploaded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(papers as PaperWithCategory[]).map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
                >
                  <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-rose-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{paper.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {paper.category.name} · {paper.year}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </a>
                    <DeletePaperButton id={paper.id} />
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