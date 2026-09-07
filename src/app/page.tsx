import { prisma } from "@/lib/db";
import { ensureCategorySlugs } from "@/app/actions/categories";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { ProductItem } from "@/components/menu/ProductItem";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

type MenuBlock =
  | {
      type: "category";
      sortOrder: number;
      id: string;
      name: string;
      slug: string;
      products: Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl: string | null;
        available: boolean;
        featured: boolean;
        showInNav: boolean;
      }>;
    }
  | {
      type: "product";
      sortOrder: number;
      product: {
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl: string | null;
        available: boolean;
        featured: boolean;
        showInNav: boolean;
      };
    };

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ masa?: string }>;
}) {
  const { masa } = await searchParams;
  await ensureCategorySlugs();

  const [restaurant, categories, loneProducts] = await Promise.all([
    prisma.restaurant.findUnique({ where: { id: "default" } }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.product.findMany({
      where: { categoryId: null },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const name = restaurant?.name ?? "By Balet";

  const blocks: MenuBlock[] = [
    ...categories
      .filter((c) => c.products.length > 0)
      .map((c) => ({
        type: "category" as const,
        sortOrder: c.sortOrder,
        id: c.id,
        name: c.name,
        slug: c.slug || c.id,
        products: c.products,
      })),
    ...loneProducts.map((p) => ({
      type: "product" as const,
      sortOrder: p.sortOrder,
      product: p,
    })),
  ].sort((a, b) => a.sortOrder - b.sortOrder);

  const navItems = blocks.flatMap((block) => {
    if (block.type === "category") {
      return [{ id: block.id, name: block.name, slug: block.slug }];
    }
    if (block.product.showInNav) {
      return [
        {
          id: block.product.id,
          name: block.product.name,
          slug: slugify(block.product.name),
        },
      ];
    }
    return [];
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-5 pt-12 pb-8 text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-olive/50 shadow-[0_0_40px_-12px_rgba(240,160,32,0.55)]">
          <div className="flex h-[6.5rem] w-[6.5rem] flex-col items-center justify-center rounded-full border border-olive/25">
            <p className="font-[family-name:var(--font-script)] text-[2.35rem] leading-none text-olive">
              By Balet
            </p>
            <p className="mt-1 text-[9px] tracking-[0.28em] text-ink uppercase">
              Cafe & Bistro
            </p>
          </div>
        </div>

        {restaurant?.tagline ? (
          <p className="mt-5 text-sm text-muted">{restaurant.tagline}</p>
        ) : null}

        {masa ? (
          <p className="mt-5 inline-flex rounded-full border border-olive/40 bg-paper px-4 py-1.5 text-sm text-olive">
            Masa {masa}
          </p>
        ) : null}
      </header>

      {navItems.length > 0 ? <CategoryNav categories={navItems} /> : null}

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-16">
        {blocks.length === 0 ? (
          <p className="py-20 text-center text-muted">
            Menü henüz hazırlanıyor. Lütfen birazdan tekrar bakın.
          </p>
        ) : (
          blocks.map((block, index) => {
            const prev = blocks[index - 1];
            const next = blocks[index + 1];

            if (block.type === "category") {
              const afterFeatured =
                prev?.type === "product" && prev.product.featured;
              const hasFollowing = index < blocks.length - 1;
              return (
                <section
                  key={`cat-${block.id}`}
                  id={block.slug}
                  className={
                    afterFeatured
                      ? `scroll-mt-20 pt-16${hasFollowing ? " pb-10" : ""}`
                      : `scroll-mt-20 pt-10${hasFollowing ? " pb-10" : ""}`
                  }
                >
                  <h2 className="text-center font-serif text-[1.65rem] font-bold tracking-[0.22em] text-olive uppercase">
                    {block.name}
                  </h2>
                  <div className="mx-auto mt-2 mb-6 h-px w-16 bg-olive/60" />
                  <div>
                    {block.products.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            }

            const product = block.product;
            const inNav = product.showInNav;
            const anchor = inNav ? slugify(product.name) : undefined;
            const besideCategory =
              product.featured &&
              (prev?.type === "category" || next?.type === "category");

            return (
              <section
                key={`prod-${product.id}`}
                id={anchor}
                className={
                  besideCategory
                    ? "scroll-mt-20 py-8"
                    : inNav
                      ? "scroll-mt-20 pt-4"
                      : "pt-2"
                }
              >
                <ProductItem product={product} featured={product.featured} />
              </section>
            );
          })
        )}
      </main>

      <footer className="border-t border-line bg-paper/80 px-5 py-10 text-center text-sm text-muted">
        <p className="font-[family-name:var(--font-script)] text-3xl text-olive">
          {name}
        </p>
        {restaurant?.description ? (
          <p className="mx-auto mt-2 max-w-md leading-relaxed">
            {restaurant.description}
          </p>
        ) : null}
        <div className="mt-4 space-y-1">
          {restaurant?.address ? <p>{restaurant.address}</p> : null}
          {restaurant?.phone ? (
            <p className="text-olive">{restaurant.phone}</p>
          ) : null}
          {restaurant?.instagram ? (
            <p>
              Instagram{" "}
              <span className="text-olive">@{restaurant.instagram}</span>
            </p>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
