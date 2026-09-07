"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, isValidSession, sessionToken } from "@/lib/auth";

export async function requireAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!(await isValidSession(token))) {
    redirect("/admin/login");
  }
}

export async function login(_prev: unknown, formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const expectedUser = process.env.ADMIN_USER ?? "admin";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "admin123";

  if (username !== expectedUser || password !== expectedPass) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}
