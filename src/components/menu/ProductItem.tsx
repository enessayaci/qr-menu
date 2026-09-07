import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

export function ProductItem({ product }: { product: Product }) {
  return (
    <article
      className={cn(
        "flex items-start gap-4 py-4",
        !product.available && "opacity-45",
      )}
    >
      {product.imageUrl ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-line sm:h-20 sm:w-20">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="shrink-0 text-[1.05rem] font-medium tracking-wide text-ink">
            {product.name}
          </h3>
          <span
            className="mb-1 min-w-4 flex-1 border-b border-dotted border-olive/35"
            aria-hidden
          />
          <span className="shrink-0 text-[1.05rem] font-semibold text-olive tabular-nums">
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
