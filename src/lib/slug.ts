/** Türkçe karakterleri URL-dostu slug'a çevirir: "Soğuk İçecekler" → "soguk-icecekler" */
export function slugify(text: string) {
  const base = text
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "kategori";
}
