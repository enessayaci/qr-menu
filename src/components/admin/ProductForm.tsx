"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  featured?: boolean;
  showInNav?: boolean;
  categoryId: string | null;
};

const field =
  "w-full rounded-2xl border border-line bg-cream/30 px-4 py-3 outline-none transition focus:border-olive focus:bg-paper";

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  product?: Product;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(product?.imageUrl ?? "");
  const [removeImage, setRemoveImage] = useState(false);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");

  function clearImage() {
    setPreview("");
    setRemoveImage(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  const isLone = !categoryId;

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"
    >
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {removeImage ? <input type="hidden" name="removeImage" value="on" /> : null}

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Ürün adı</span>
          <input name="name" required defaultValue={product?.name} className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Açıklama</span>
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description}
            className={field}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Fiyat (₺)</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={product?.price}
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Kategori</span>
            <select
              name="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={field}
            >
              <option value="">Kategorisiz (ana menüde)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-cream/30 px-4 py-3">
          <input
            name="available"
            type="checkbox"
            defaultChecked={product?.available ?? true}
            className="size-4 accent-olive"
          />
          <span className="text-sm">Menüde görünsün, satışta</span>
        </label>
        {isLone ? (
          <>
            <label className="flex items-center gap-3 rounded-2xl border border-olive/30 bg-olive/5 px-4 py-3">
              <input
                name="showInNav"
                type="checkbox"
                defaultChecked={product?.showInNav ?? false}
                className="size-4 accent-olive"
              />
              <span className="text-sm">
                Yukarıda listele — üstteki kaydırılabilir menüde görünsün
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-olive/30 bg-olive/5 px-4 py-3">
              <input
                name="featured"
                type="checkbox"
                defaultChecked={product?.featured ?? false}
                className="size-4 accent-olive"
              />
              <span className="text-sm">
                Dikkat çekici ürün — başlık kategori gibi kalın turuncu
              </span>
            </label>
          </>
        ) : null}
      </div>

      <div>
        <span className="mb-1.5 block text-sm text-muted">Fotoğraf</span>
        <label
          className={cn(
            "relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-line bg-cream/40 text-center text-sm text-muted transition hover:border-olive hover:bg-paper",
          )}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span>Fotoğraf seç</span>
          )}
          <input
            ref={fileRef}
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setRemoveImage(false);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
        <p className="mt-2 text-xs text-muted">JPG, PNG, WEBP veya GIF. En fazla 4 MB.</p>
        {(preview || (product?.imageUrl && !removeImage)) ? (
          <button
            type="button"
            onClick={clearImage}
            className="mt-3 w-full rounded-2xl border border-rose/40 bg-rose/10 px-4 py-2.5 text-sm text-rose transition hover:bg-rose/20"
          >
            Fotoğrafı kaldır
          </button>
        ) : null}
        {removeImage ? (
          <p className="mt-2 text-xs text-muted">
            Kayıttan sonra fotoğraf silinecek.
          </p>
        ) : null}
      </div>

      <div className="lg:col-span-2">
        <button
          type="submit"
          className="rounded-2xl bg-olive px-6 py-3 font-medium text-paper transition hover:bg-olive-dark"
        >
          {product ? "Değişiklikleri kaydet" : "Ürünü oluştur"}
        </button>
      </div>
    </form>
  );
}
