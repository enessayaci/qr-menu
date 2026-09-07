import {
  createCategory,
  deleteCategory,
  moveCategory,
  updateCategory,
} from "@/app/actions/categories";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Category = {
  id: string;
  name: string;
  _count: { products: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-4">
      <form
        action={createCategory}
        className="flex flex-col gap-3 rounded-3xl border border-line bg-paper p-4 sm:flex-row"
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
          Ekle
        </button>
      </form>

      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li
            key={category.id}
            className="rounded-3xl border border-line bg-paper p-4"
          >
            <form action={updateCategory} className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="id" value={category.id} />
              <input
                name="name"
                required
                defaultValue={category.name}
                className="flex-1 rounded-2xl border border-line bg-cream/30 px-4 py-3 outline-none focus:border-olive"
              />
              <button
                type="submit"
                className="rounded-2xl border border-line px-4 py-3 text-sm hover:bg-cream"
              >
                Kaydet
              </button>
            </form>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <span>{category._count.products} ürün</span>
              <div className="flex items-center gap-3">
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    className="disabled:opacity-30"
                  >
                    Yukarı
                  </button>
                </form>
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={index === categories.length - 1}
                    className="disabled:opacity-30"
                  >
                    Aşağı
                  </button>
                </form>
                <DeleteButton
                  action={deleteCategory}
                  id={category.id}
                  confirmText={`${category.name} ve içindeki tüm ürünler silinsin mi?`}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
