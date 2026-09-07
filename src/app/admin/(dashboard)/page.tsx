import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/admin/ProductCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ürünler" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { category: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold">Ürünler</h1>
          <p className="mt-1 text-muted">
            Fiyat, fotoğraf ve stok durumunu buradan yönetin.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-2xl bg-olive px-5 py-3 font-medium text-paper hover:bg-olive-dark"
        >
          Yeni ürün
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-muted">
          Henüz ürün yok. Önce bir kategori ekleyip ardından ürün oluşturun.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
