import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.restaurant.deleteMany();

  await prisma.restaurant.create({
    data: {
      id: "default",
      name: "By Balet",
      tagline: "Cafe & Bistro",
      description: "Balıkesir Üniversitesi Çağış Kampüsü’nde taze ve doyurucu lezzetler.",
      phone: "0507 685 20 99",
      address: "Balıkesir Üniversitesi Çağış Kampüsü, Çağış, 17 sk no: 2D",
      instagram: "",
    },
  });

  const menuler = await prisma.category.create({
    data: { name: "Menüler", slug: "menuler", sortOrder: 1 },
  });
  const kahvalti = await prisma.category.create({
    data: { name: "Kahvaltı", slug: "kahvalti", sortOrder: 2 },
  });
  const yemekler = await prisma.category.create({
    data: { name: "Yemekler", slug: "yemekler", sortOrder: 3 },
  });
  const soguk = await prisma.category.create({
    data: { name: "Soğuk İçecekler", slug: "soguk-icecekler", sortOrder: 4 },
  });
  const sicak = await prisma.category.create({
    data: { name: "Sıcak İçecekler", slug: "sicak-icecekler", sortOrder: 5 },
  });
  const tatlilar = await prisma.category.create({
    data: { name: "Tatlılar", slug: "tatlilar", sortOrder: 6 },
  });

  await prisma.product.createMany({
    data: [
      // Menüler
      {
        name: "By Balet Menü",
        description: "Köfte, pilav, patates, şişe kola",
        price: 320,
        sortOrder: 1,
        categoryId: menuler.id,
      },
      {
        name: "Pizza Menü",
        description: "Pizza, patates, şişe kola",
        price: 270,
        sortOrder: 2,
        categoryId: menuler.id,
      },
      {
        name: "Döner Menü",
        description: "Tavuk döner, patates, şişe kola",
        price: 250,
        sortOrder: 3,
        categoryId: menuler.id,
      },
      {
        name: "Et Burger Menü",
        description: "Et burger, patates, şişe kola",
        price: 300,
        sortOrder: 4,
        categoryId: menuler.id,
      },
      {
        name: "Tavuk Burger Menü",
        description: "Tavuk burger, patates, şişe kola",
        price: 250,
        sortOrder: 5,
        categoryId: menuler.id,
      },
      {
        name: "Çıtır Menü",
        description: "Çıtır tavuk, patates, şişe kola",
        price: 250,
        sortOrder: 6,
        categoryId: menuler.id,
      },
      {
        name: "Nugget Menü",
        description: "Nugget, patates, şişe kola",
        price: 220,
        sortOrder: 7,
        categoryId: menuler.id,
      },

      // Kahvaltı
      {
        name: "Kahvaltı Tabağı",
        description:
          "Yumurta, krem peynir, tereyağ, zeytin, reçel, patates, domates, çay",
        price: 180,
        sortOrder: 1,
        categoryId: kahvalti.id,
      },

      // Yemekler
      {
        name: "Susurluk Tostu (Karışık)",
        description: "Patates, turşu",
        price: 180,
        sortOrder: 1,
        categoryId: yemekler.id,
      },
      {
        name: "Susurluk Tostu (Peynirli)",
        description: "Patates, turşu",
        price: 160,
        sortOrder: 2,
        categoryId: yemekler.id,
      },
      {
        name: "Pizza",
        description: "",
        price: 220,
        sortOrder: 3,
        categoryId: yemekler.id,
      },
      {
        name: "Patso",
        description: "",
        price: 150,
        sortOrder: 4,
        categoryId: yemekler.id,
      },
      {
        name: "Köfte Ekmek",
        description: "",
        price: 220,
        sortOrder: 5,
        categoryId: yemekler.id,
      },
      {
        name: "Sosisli Sandviç",
        description: "Dana etli, patatesli",
        price: 190,
        sortOrder: 6,
        categoryId: yemekler.id,
      },
      {
        name: "Sucuk Ekmek",
        description: "Dana etli",
        price: 250,
        sortOrder: 7,
        categoryId: yemekler.id,
      },
      {
        name: "Et Burger",
        description: "",
        price: 220,
        sortOrder: 8,
        categoryId: yemekler.id,
      },
      {
        name: "Tavuk Burger",
        description: "",
        price: 190,
        sortOrder: 9,
        categoryId: yemekler.id,
      },
      {
        name: "Tavuk Döner",
        description: "",
        price: 180,
        sortOrder: 10,
        categoryId: yemekler.id,
      },
      {
        name: "Tavuk Pilav",
        description: "",
        price: 200,
        sortOrder: 11,
        categoryId: yemekler.id,
      },
      {
        name: "Nugget Pilav",
        description: "",
        price: 180,
        sortOrder: 12,
        categoryId: yemekler.id,
      },
      {
        name: "Çıtır Tavuk Pilav",
        description: "",
        price: 180,
        sortOrder: 13,
        categoryId: yemekler.id,
      },
      {
        name: "Spagetti Bolonez",
        description: "",
        price: 200,
        sortOrder: 14,
        categoryId: yemekler.id,
      },
      {
        name: "Günün Çorbası",
        description: "",
        price: 120,
        sortOrder: 15,
        categoryId: yemekler.id,
      },

      // Soğuk içecekler
      {
        name: "Kutu Kola",
        description: "",
        price: 80,
        sortOrder: 1,
        categoryId: soguk.id,
      },
      {
        name: "Ice Tea",
        description: "",
        price: 80,
        sortOrder: 2,
        categoryId: soguk.id,
      },
      {
        name: "Kutu Meyve Suyu",
        description: "",
        price: 80,
        sortOrder: 3,
        categoryId: soguk.id,
      },
      {
        name: "Sade Soda",
        description: "",
        price: 70,
        sortOrder: 4,
        categoryId: soguk.id,
      },
      {
        name: "Meyveli Soda",
        description: "",
        price: 80,
        sortOrder: 5,
        categoryId: soguk.id,
      },
      {
        name: "Ayran",
        description: "",
        price: 50,
        sortOrder: 6,
        categoryId: soguk.id,
      },
      {
        name: "Su",
        description: "",
        price: 15,
        sortOrder: 7,
        categoryId: soguk.id,
      },

      // Sıcak içecekler
      {
        name: "Çay",
        description: "",
        price: 25,
        sortOrder: 1,
        categoryId: sicak.id,
      },
      {
        name: "Nescafe",
        description: "",
        price: 60,
        sortOrder: 2,
        categoryId: sicak.id,
      },
      {
        name: "Türk Kahvesi",
        description: "",
        price: 60,
        sortOrder: 3,
        categoryId: sicak.id,
      },

      // Tatlılar
      {
        name: "Puding",
        description: "",
        price: 60,
        sortOrder: 1,
        categoryId: tatlilar.id,
      },
      {
        name: "Kazandibi",
        description: "",
        price: 60,
        sortOrder: 2,
        categoryId: tatlilar.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
