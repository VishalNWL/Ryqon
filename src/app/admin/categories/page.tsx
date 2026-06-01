import { getCategories } from "@/actions/category";
import AddCategoryForm from "@/features/admin/AddCategoryForm";
import DeleteCategoryButton from "@/features/admin/DeleteCategoryButton";
import { Tags } from "lucide-react";

type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    questions: number;
    papers: number;
  };
};

export default async function CategoriesPage() {
  const { data: categories } = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage exam categories like JEE and NEET
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-4">Add New Category</h2>
          <AddCategoryForm />
        </div>

        <div>
          <h2 className="font-semibold mb-4">
            Existing Categories ({categories.length})
          </h2>

          {categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <Tags className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No categories yet. Add one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(categories as CategoryWithCount[]).map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
                >
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cat._count.questions} questions · {cat._count.papers} papers
                    </p>
                    {cat.description && (
                      <p className="text-xs text-muted-foreground">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <DeleteCategoryButton id={cat.id} name={cat.name} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}