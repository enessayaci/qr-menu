import { PrismaClient } from "@prisma/client";
import { spawnSync } from "node:child_process";

const prisma = new PrismaClient();

try {
  const count = await prisma.restaurant.count();
  if (count > 0) {
    console.log(">> Menü verisi mevcut, seed atlandı.");
  } else {
    console.log(">> Boş veritabanı — örnek menü yükleniyor...");
    const result = spawnSync(process.execPath, ["prisma/seed.mjs"], {
      stdio: "inherit",
      env: process.env,
    });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
} finally {
  await prisma.$disconnect();
}
