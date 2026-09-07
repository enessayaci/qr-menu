import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024;

function uploadRoot() {
  return (
    process.env.UPLOAD_DIR ??
    path.join(process.cwd(), "data", "uploads")
  );
}

function extensionFor(type: string, filename: string) {
  switch (type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default: {
      const fromName = path.extname(filename).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fromName)) {
        return fromName === ".jpeg" ? ".jpg" : fromName;
      }
      return ".jpg";
    }
  }
}

function sniffType(file: File) {
  if (file.type && ALLOWED.has(file.type)) return file.type;
  const ext = path.extname(file.name).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return file.type;
}

export function resolveUploadPath(imageUrl: string) {
  const name = imageUrl.replace(/^\/uploads\//, "");
  return path.join(uploadRoot(), name);
}

export async function saveUpload(file: File) {
  const type = sniffType(file);
  if (!ALLOWED.has(type)) {
    throw new Error("Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Görsel 4 MB'den küçük olmalıdır.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extensionFor(type, file.name)}`;
  const dir = uploadRoot();
  await mkdir(dir, { recursive: true });
  const fullPath = path.join(dir, name);
  await writeFile(fullPath, bytes);
  console.log("[upload] saved", fullPath, bytes.length, "bytes");
  return `/uploads/${name}`;
}

export async function deleteUpload(imageUrl?: string | null) {
  if (!imageUrl?.startsWith("/uploads/")) return;
  try {
    await unlink(resolveUploadPath(imageUrl));
  } catch {
    // legacy public path
    try {
      await unlink(path.join(process.cwd(), "public", imageUrl));
    } catch {
      // already gone
    }
  }
}
