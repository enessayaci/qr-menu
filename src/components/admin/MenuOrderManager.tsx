import Link from "next/link";
import { moveMenuBlock, moveProductInCategory } from "@/app/actions/order";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/actions/categories";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatPrice } from "@/lib/format";
import type { MenuBlock } from "@/lib/menu-order";

type CategoryProduct = {
  id: string;
  name: string;
  price: number;
  sortOrder: number;
};

type CategoryWithProducts = {
  id: string;
  name: string;
  products: CategoryProduct[];
};

export function MenuOrderManager({
  blocks,
  categories,
}: {
  blocks: MenuBlock[];
  categories: CategoryWithProducts[];
}) {
  const productsByCategory = new Map(
    categories.map((c) => [c.id, c.products] as const),
  );

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-2xl font-semibold">Ana menü sırası</h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          Kategoriler ve kategorisiz ürünler birlikte sıralanır.
        </p>

        <form
          action={createCategory}
          className="mb-4 flex flex-col gap-3 rounded-3xl border border-line bg-paper p-4 sm:flex-row"
        >
          <input
            name="name"
            required
            placeholder="Yeni kategori adı"
            className="flex-1 rounded-2xl border border-line bg-cream/30 px-4 py-3 outline-none focus:border-olive"
          />
          <button
            type="submit"
            className="rounded-2xl bg-olive px-5 py-3 font-medium text-paper hover:bg-olive-dark"
          >
            Kategori ekle
          </button>
        </form>

        <ul className="space-y-3">
          {blocks.map((block, index) => (
            <li
              key={`${block.type}-${block.id}`}
              className="rounded-3xl border border-line bg-paper p-4"
            >
              {block.type === "category" ? (
                <form
                  action={updateCategory}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input type="hidden" name="id" value={block.id} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[10px] tracking-[0.18em] text-olive uppercase">
                      Kategori
                    </span>
                    <input
                      name="name"
                      required
                      defaultValue={block.name}
                      className="w-full rounded-2xl border border-line bg-cream/30 px-4 py-3 outline-none focus:border-olive"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-2xl border border-line px-4 py-3 text-sm hover:bg-cream"
                  >
                    Kaydet
                  </button>
                </form>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] tracking-[0.18em] text-brass uppercase">
                      Kategorisiz ürün
                    </span>
                    <p className="font-serif text-xl font-semibold">
                      {block.name}
                    </p>
                    <p className="text-sm text-muted">
                      {formatPrice(block.price)}
                      {block.showInNav ? " · Yukarıda listelenir" : ""}
                      {block.featured ? " · Dikkat çekici" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/${block.id}`}
                    className="text-sm text-olive hover:underline"
                  >
                    Düzenle
                  </Link>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                <span>
                  {block.type === "category"
                    ? `${block.productCount} ürün`
                    : [
                        block.showInNav ? "Üst menüde" : null,
                        block.featured ? "Başlık stili" : "Normal stil",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                </span>
                <div className="flex items-center gap-3">
                  <form action={moveMenuBlock}>
                    <input type="hidden" name="type" value={block.type} />
                    <input type="hidden" name="id" value={block.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index === 0}
                      className="disabled:opacity-30"
                    >
                      Yukarı
                    </button>
                  </form>
                  <form action={moveMenuBlock}>
                    <input type="hidden" name="type" value={block.type} />
                    <input type="hidden" name="id" value={block.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === blocks.length - 1}
                      className="disabled:opacity-30"
                    >
                      Aşağı
                    </button>
                  </form>
                  {block.type === "category" ? (
                    <DeleteButton
                      action={deleteCategory}
                      id={block.id}
                      confirmText={`${block.name} ve içindeki tüm ürünler silinsin mi?`}
                    />
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold">
            Kategori içi ürün sırası
          </h2>
          <p className="mt-1 text-sm text-muted">
            Bir kategorideki ürünlerin kendi aralarındaki sırası.
          </p>
        </div>

        {categories.map((category) => {
          const products = productsByCategory.get(category.id) ?? [];
          if (products.length === 0) return null;
          return (
            <div
              key={category.id}
              className="rounded-3xl border border-line bg-paper p-4"
            >
              <h3 className="font-serif text-xl font-semibold text-olive">
                {category.name}
              </h3>
              <ul className="mt-3 divide-y divide-line">
                {products.map((product, index) => (
                  <li
                    key={product.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-olive hover:underline"
                      >
                        Düzenle
                      </Link>
                      <form action={moveProductInCategory}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={index === 0}
                          className="disabled:opacity-30"
                        >
                          Yukarı
                        </button>
                      </form>
                      <form action={moveProductInCategory}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={index === products.length - 1}
                          className="disabled:opacity-30"
                        >
                          Aşağı
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
