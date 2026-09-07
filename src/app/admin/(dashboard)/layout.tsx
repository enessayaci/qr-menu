import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <AdminNav restaurantName={restaurant?.name ?? "By Balet"} />
      <div className="flex-1 px-5 py-8 md:px-10">{children}</div>
    </div>
  );
}
