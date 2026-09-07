import { prisma } from "@/lib/db";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kategoriler" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl font-semibold">Kategoriler</h1>
      <p className="mt-1 mb-8 text-muted">
        Kategori ekleyin, düzenleyin veya silin. Ürünler kategorili veya
        kategorisiz eklenebilir.
      </p>
      <CategoryManager categories={categories} />
    </div>
  );
}
