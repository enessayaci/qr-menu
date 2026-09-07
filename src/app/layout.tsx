import type { Metadata } from "next";
import { Great_Vibes, Outfit, Source_Sans_3 } from "next/font/google";
import { prisma } from "@/lib/db";
import "./globals.css";

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

const serif = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-serif",
});

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: "default" },
    });
    const name = restaurant?.name ?? "By Balet";
    return {
      title: {
        default: `${name} Menü`,
        template: `%s · ${name}`,
      },
      description: restaurant?.tagline || "Dijital QR menü",
    };
  } catch {
    return { title: "Menü" };
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${script.variable} ${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
