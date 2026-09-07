"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { deleteUpload, saveUpload } from "@/lib/upload";
import { requireAdmin } from "@/app/actions/auth";
import { nextProductSortOrder } from "@/lib/menu-order";

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
  const categoryRaw = String(formData.get("categoryId") ?? "").trim();
  const categoryId = categoryRaw || null;
  const available = formData.get("available") === "on";
  const featured = formData.get("featured") === "on" && !categoryId;
  const showInNav = formData.get("showInNav") === "on" && !categoryId;
  const removeImage = formData.get("removeImage") === "on";
  const upload = await fileFromForm(formData);

  if (!name || Number.isNaN(price) || price < 0) {
    throw new Error("Ürün adı ve geçerli bir fiyat gerekli.");
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

  const categoryChanged = current && current.categoryId !== categoryId;

  if (id) {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        available,
        featured,
        showInNav,
        imageUrl,
        ...(categoryChanged
          ? { sortOrder: await nextProductSortOrder(categoryId) }
          : {}),
      },
    });
  } else {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        available,
        featured,
        showInNav,
        imageUrl,
        sortOrder: await nextProductSortOrder(categoryId),
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/order");
  revalidatePath("/admin/categories");
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
  revalidatePath("/admin/order");
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
