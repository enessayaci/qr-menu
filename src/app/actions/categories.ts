"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/actions/auth";

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const last = await prisma.category.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.category.create({
    data: { name, sortOrder: (last?.sortOrder ?? 0) + 1 },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  await prisma.category.update({ where: { id }, data: { name } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
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
