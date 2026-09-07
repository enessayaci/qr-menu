import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ProductThumb } from "@/components/menu/ProductThumb";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  featured?: boolean;
};

export function ProductItem({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const isFeatured = featured || product.featured;

  return (
    <article
      className={cn(
        "flex items-start gap-4 py-4",
        !product.available && "opacity-45",
      )}
    >
      {product.imageUrl ? (
        <ProductThumb src={product.imageUrl} alt={product.name} />
      ) : null}

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "flex flex-wrap items-baseline-last gap-x-2",
            isFeatured ? "text-[1.55rem] leading-tight" : "text-[1.05rem] leading-snug",
          )}
        >
          <h3
            className={cn(
              "min-w-0 max-w-[calc(100%-5.5rem)] wrap-break-word",
              isFeatured
                ? "font-display font-extrabold tracking-[0.08em] text-olive"
                : "font-medium text-ink",
            )}
          >
            {product.name}
          </h3>
          <span
            aria-hidden
            className="mb-[0.22em] min-w-4 flex-1 border-b border-dotted border-olive/35"
          />
          <span
            className={cn(
              "shrink-0 font-semibold text-olive tabular-nums",
              isFeatured && "font-display font-extrabold tracking-[0.04em]",
            )}
          >
            {formatPrice(product.price)}
          </span>
        </div>
        {product.description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        ) : null}
        {!product.available ? (
          <p className="mt-2 text-xs tracking-[0.18em] text-rose uppercase">
            Tükendi
          </p>
        ) : null}
      </div>
    </article>
  );
}
