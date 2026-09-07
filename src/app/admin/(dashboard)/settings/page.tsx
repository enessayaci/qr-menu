import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Restoran" };

export default async function SettingsPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: "default" },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">Restoran</h1>
      <p className="mt-1 mb-8 text-muted">
        Menü başlığı, adres ve iletişim bilgileri müşteri sayfasında görünür.
      </p>
      <SettingsForm
        restaurant={
          restaurant ?? {
            name: "By Balet",
            tagline: "",
            description: "",
            phone: "",
            address: "",
            instagram: "",
          }
        }
      />
    </div>
  );
}
