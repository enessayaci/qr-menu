"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Ürünler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/order", label: "Sıralama" },
  { href: "/admin/qr", label: "QR Kodlar" },
  { href: "/admin/settings", label: "Restoran" },
];

export function AdminNav({ restaurantName }: { restaurantName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="no-print border-b border-line bg-paper md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 md:block">
        <div>
          <p className="font-serif text-2xl font-semibold">{restaurantName}</p>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">
            Yönetim
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-line px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menü
        </button>
      </div>
      <nav
        className={cn(
          "flex-col gap-1 px-3 pb-4 md:flex",
          open ? "flex" : "hidden md:flex",
        )}
      >
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin" || pathname.startsWith("/admin/products")
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-olive text-paper"
                  : "text-muted hover:bg-cream hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/"
          target="_blank"
          className="rounded-xl px-3 py-2 text-sm text-muted hover:bg-cream hover:text-ink"
        >
          Menüyü gör
        </Link>
        <form action={logout} className="mt-2">
          <button
            type="submit"
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose hover:bg-cream"
          >
            Çıkış
          </button>
        </form>
      </nav>
    </aside>
  );
}
