import Link from "next/link";
import { deleteProduct, toggleProductAvailable } from "@/app/actions/products";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
  category: { name: string } | null;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-paper">
      <div className="relative aspect-[4/3] bg-cream">
        {product.imageUrl ? (
          <ProductImage src={product.imageUrl} alt={product.name} fill />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted">
            <span className="text-sm">Fotoğraf yok</span>
            <span className="text-xs">Düzenle’den yükleyebilirsiniz</span>
          </div>
        )}
        {!product.available ? (
          <span className="absolute top-3 left-3 rounded-full bg-olive px-3 py-1 text-xs text-cream">
            Tükendi
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-xs tracking-wide text-brass uppercase">
          {product.category?.name ??
            (product.featured ? "Dikkat çekici" : "Kategorisiz")}
        </p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold">{product.name}</h2>
          <span className="text-sm font-medium tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/products/${product.id}`}
              className="text-sm text-olive hover:underline"
            >
              Düzenle
            </Link>
            <DeleteButton
              action={deleteProduct}
              id={product.id}
              confirmText={`${product.name} silinsin mi? Bu işlem geri alınamaz.`}
            />
          </div>
          <form action={toggleProductAvailable}>
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className={cn(
                "rounded-full px-3 py-1 text-xs",
                product.available
                  ? "bg-cream text-muted"
                  : "bg-olive/10 text-olive",
              )}
            >
              {product.available ? "Tükendi işaretle" : "Satışa aç"}
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
