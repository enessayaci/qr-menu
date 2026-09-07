import Link from "next/link";
import { notFound } from "next/navigation";
import { saveProduct } from "@/app/actions/products";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ürünü düzenle" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin" className="text-sm text-olive hover:underline">
        ← Ürünlere dön
      </Link>
      <h1 className="mt-4 font-serif text-4xl font-semibold">{product.name}</h1>
      <p className="mt-1 mb-8 text-muted">
        Fiyat, görsel veya metni güncelleyin.
      </p>
      <ProductForm
        action={saveProduct}
        categories={categories}
        product={product}
      />
    </div>
  );
}
