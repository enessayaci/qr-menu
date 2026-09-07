"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Category = { id: string; name: string };

export function CategoryNav({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");

  useEffect(() => {
    const syncActive = () => {
      const offset = 120;
      let current = categories[0]?.id ?? "";

      for (const category of categories) {
        const el = document.getElementById(`kategori-${category.id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = category.id;
        }
      }

      setActive(current);
    };

    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, [categories]);

  useEffect(() => {
    const pill = document.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    pill?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <nav className="sticky top-0 z-20 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#kategori-${category.id}`}
            data-cat={category.id}
            onClick={() => setActive(category.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm tracking-wide transition",
              active === category.id
                ? "bg-olive text-cream shadow-sm"
                : "bg-paper text-muted hover:text-ink",
            )}
          >
            {category.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
