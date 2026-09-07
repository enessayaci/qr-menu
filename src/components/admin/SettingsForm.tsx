import { saveSettings } from "@/app/actions/settings";

const field =
  "w-full rounded-2xl border border-line bg-cream/30 px-4 py-3 outline-none transition focus:border-olive focus:bg-paper";

type Restaurant = {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  address: string;
  instagram: string;
};

export function SettingsForm({ restaurant }: { restaurant: Restaurant }) {
  return (
    <form action={saveSettings} className="max-w-xl space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Restoran adı</span>
        <input name="name" required defaultValue={restaurant.name} className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Alt başlık</span>
        <input name="tagline" defaultValue={restaurant.tagline} className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Kısa açıklama</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={restaurant.description}
          className={field}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Telefon</span>
        <input name="phone" defaultValue={restaurant.phone} className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Adres</span>
        <input name="address" defaultValue={restaurant.address} className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Instagram</span>
        <input
          name="instagram"
          defaultValue={restaurant.instagram}
          placeholder="kullaniciadi"
          className={field}
        />
      </label>
      <button
        type="submit"
        className="rounded-2xl bg-olive px-6 py-3 font-medium text-paper hover:bg-olive-dark"
      >
        Kaydet
      </button>
    </form>
  );
}
