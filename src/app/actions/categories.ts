"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/actions/auth";
import { deleteUpload } from "@/lib/upload";
import { slugify } from "@/lib/slug";
import { nextMenuSortOrder } from "@/lib/menu-order";

async function uniqueCategorySlug(name: string, excludeId?: string) {
  const base = slugify(name);
  let candidate = base;
  let n = 2;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

/** Eski kayıtlarda boş kalan slug'ları doldurur */
export async function ensureCategorySlugs() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });

  for (const category of categories) {
    if (category.slug) continue;
    const slug = await uniqueCategorySlug(category.name, category.id);
    await prisma.category.update({
      where: { id: category.id },
      data: { slug },
    });
  }
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.category.create({
    data: {
      name,
      slug: await uniqueCategorySlug(name),
      sortOrder: await nextMenuSortOrder(),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/order");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: await uniqueCategorySlug(name, id),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/order");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const products = await prisma.product.findMany({
    where: { categoryId: id },
    select: { imageUrl: true },
  });

  await prisma.category.delete({ where: { id } });
  await Promise.all(products.map((p) => deleteUpload(p.imageUrl)));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/order");
}

export async function moveCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const index = categories.findIndex((c) => c.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= categories.length) return;

  const current = categories[index];
  const other = categories[swapWith];

  await prisma.$transaction([
    prisma.category.update({
      where: { id: current.id },
      data: { sortOrder: other.sortOrder },
    }),
    prisma.category.update({
      where: { id: other.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/categories");
}
