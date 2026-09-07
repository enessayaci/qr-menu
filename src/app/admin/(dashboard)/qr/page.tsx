import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { QrStudio } from "@/components/admin/QrStudio";

export const dynamic = "force-dynamic";
export const metadata = { title: "QR Kodlar" };

export default async function QrPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: "default" },
  });
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">QR kodlar</h1>
      <p className="mt-1 mb-8 max-w-2xl text-muted">
        Oluşturduğunuz kodları yazdırıp masalara koyun. Müşteri okuttuğunda
        doğrudan dijital menüye gider.
      </p>
      <QrStudio
        baseUrl={baseUrl}
        restaurantName={restaurant?.name ?? "By Balet"}
      />
    </div>
  );
}
