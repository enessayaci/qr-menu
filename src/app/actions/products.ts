"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { deleteUpload, saveUpload } from "@/lib/upload";
import { requireAdmin } from "@/app/actions/auth";

async function nextSortOrder(categoryId: string) {
  const last = await prisma.product.findFirst({
    where: { categoryId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? 0) + 1;
}

async function fileFromForm(formData: FormData): Promise<File | null> {
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) return image;
  if (image && typeof image === "object" && "arrayBuffer" in image) {
    const blob = image as Blob;
    if (blob.size > 0) {
      return new File([blob], "upload.jpg", {
        type: blob.type || "image/jpeg",
      });
    }
  }
  return null;
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const categoryId = String(formData.get("categoryId") ?? "");
  const available = formData.get("available") === "on";
  const removeImage = formData.get("removeImage") === "on";
  const upload = await fileFromForm(formData);

  if (!name || !categoryId || Number.isNaN(price) || price < 0) {
    throw new Error("Ürün adı, kategori ve geçerli bir fiyat gerekli.");
  }

  const current = id
    ? await prisma.product.findUnique({ where: { id } })
    : null;
  const previousUrl = current?.imageUrl ?? null;

  let imageUrl = previousUrl;

  if (upload) {
    imageUrl = await saveUpload(upload);
    if (previousUrl && previousUrl !== imageUrl) {
      await deleteUpload(previousUrl);
    }
  } else if (removeImage && previousUrl) {
    await deleteUpload(previousUrl);
    imageUrl = null;
  }

  if (id) {
    await prisma.product.update({
      where: { id },
      data: { name, description, price, categoryId, available, imageUrl },
    });
  } else {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        available,
        imageUrl,
        sortOrder: await nextSortOrder(categoryId),
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/products/${id}`);
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.delete({ where: { id } });
  await deleteUpload(product.imageUrl);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function removeProductImage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product?.imageUrl) return;

  await deleteUpload(product.imageUrl);
  await prisma.product.update({
    where: { id },
    data: { imageUrl: null },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/products/${id}`);
}

export async function toggleProductAvailable(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { available: !product.available },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}
