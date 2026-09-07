import Link from "next/link";
import { saveProduct } from "@/app/actions/products";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yeni ürün" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <Link href="/admin" className="text-sm text-olive hover:underline">
        ← Ürünlere dön
      </Link>
      <h1 className="mt-4 font-serif text-4xl font-semibold">Yeni ürün</h1>
      <p className="mt-1 mb-8 text-muted">
        Fotoğraf, fiyat ve açıklama ile menüye ekleyin. İsterseniz kategorisiz
        bırakabilirsiniz.
      </p>
      <ProductForm action={saveProduct} categories={categories} />
    </div>
  );
}
