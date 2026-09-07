import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024;

function extensionFor(type: string) {
  switch (type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}

export async function saveUpload(file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Görsel 4 MB'den küçük olmalıdır.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extensionFor(file.type)}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

export async function deleteUpload(imageUrl?: string | null) {
  if (!imageUrl?.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", imageUrl);
  try {
    await unlink(filePath);
  } catch {
    // already gone
  }
}
