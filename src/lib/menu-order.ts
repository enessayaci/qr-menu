import { prisma } from "@/lib/db";

/** Ana menü sırası: kategoriler + kategorisiz ürünler aynı sayı uzayında */
export async function nextMenuSortOrder() {
  const [lastCategory, lastLone] = await Promise.all([
    prisma.category.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    }),
    prisma.product.findFirst({
      where: { categoryId: null },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    }),
  ]);

  return Math.max(lastCategory?.sortOrder ?? 0, lastLone?.sortOrder ?? 0) + 1;
}

export async function nextProductSortOrder(categoryId: string | null) {
  if (!categoryId) return nextMenuSortOrder();

  const last = await prisma.product.findFirst({
    where: { categoryId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? 0) + 1;
}

export type MenuBlock =
  | {
      type: "category";
      id: string;
      sortOrder: number;
      name: string;
      slug: string | null;
      productCount: number;
    }
  | {
      type: "product";
      id: string;
      sortOrder: number;
      name: string;
      featured: boolean;
      showInNav: boolean;
      price: number;
    };

export async function getMenuBlocks(): Promise<MenuBlock[]> {
  const [categories, loneProducts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { categoryId: null },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const blocks: MenuBlock[] = [
    ...categories.map((c) => ({
      type: "category" as const,
      id: c.id,
      sortOrder: c.sortOrder,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
    })),
    ...loneProducts.map((p) => ({
      type: "product" as const,
      id: p.id,
      sortOrder: p.sortOrder,
      name: p.name,
      featured: p.featured,
      showInNav: p.showInNav,
      price: p.price,
    })),
  ];

  return blocks.sort((a, b) => a.sortOrder - b.sortOrder);
}
