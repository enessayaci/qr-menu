"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "@/components/ProductImage";

export function ProductThumb({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative h-20 w-20 shrink-0 cursor-zoom-in overflow-hidden rounded-xl bg-line transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive sm:h-24 sm:w-24"
        aria-label={`${alt} fotoğrafını büyüt`}
      >
        <ProductImage src={src} alt={alt} fill />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-5 animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/80 text-2xl text-ink hover:bg-paper"
            onClick={() => setOpen(false)}
            aria-label="Kapat"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[88vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
