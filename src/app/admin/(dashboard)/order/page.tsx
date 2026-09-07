import { prisma } from "@/lib/db";
import { getMenuBlocks } from "@/lib/menu-order";
import { MenuOrderManager } from "@/components/admin/MenuOrderManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sıralama" };

export default async function OrderPage() {
  const [blocks, categories] = await Promise.all([
    getMenuBlocks(),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: { orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl font-semibold">Sıralama</h1>
      <p className="mt-1 mb-8 text-muted">
        Ana menü bloklarını ve kategori içi ürünleri buradan yönetin.
      </p>
      <MenuOrderManager blocks={blocks} categories={categories} />
    </div>
  );
}
