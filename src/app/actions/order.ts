"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/actions/auth";
import { getMenuBlocks } from "@/lib/menu-order";

function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/order");
}

async function applyMenuOrder(
  ordered: Array<{ type: "category" | "product"; id: string }>,
) {
  await prisma.$transaction(
    ordered.map((item, index) => {
      const sortOrder = index + 1;
      if (item.type === "category") {
        return prisma.category.update({
          where: { id: item.id },
          data: { sortOrder },
        });
      }
      return prisma.product.update({
        where: { id: item.id },
        data: { sortOrder },
      });
    }),
  );
}

export async function moveMenuBlock(formData: FormData) {
  await requireAdmin();
  const type = String(formData.get("type") ?? "") as "category" | "product";
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if ((type !== "category" && type !== "product") || !id) return;

  const blocks = await getMenuBlocks();
  const index = blocks.findIndex((b) => b.type === type && b.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= blocks.length) return;

  const next = [...blocks];
  [next[index], next[swapWith]] = [next[swapWith], next[index]];
  await applyMenuOrder(next.map((b) => ({ type: b.type, id: b.id })));
  revalidateMenu();
}

export async function moveProductInCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product?.categoryId) return;

  const siblings = await prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { sortOrder: "asc" },
  });
  const index = siblings.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= siblings.length) return;

  const current = siblings[index];
  const other = siblings[swapWith];

  await prisma.$transaction([
    prisma.product.update({
      where: { id: current.id },
      data: { sortOrder: other.sortOrder },
    }),
    prisma.product.update({
      where: { id: other.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  revalidateMenu();
}
