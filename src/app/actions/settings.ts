"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/actions/auth";

export async function saveSettings(formData: FormData) {
  await requireAdmin();

  const data = {
    name: String(formData.get("name") ?? "").trim() || "By Balet",
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    instagram: String(formData.get("instagram") ?? "")
      .trim()
      .replace(/^@/, ""),
  };

  await prisma.restaurant.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
