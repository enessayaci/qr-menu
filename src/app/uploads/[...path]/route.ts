import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import path from "path";
import { constants } from "fs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await context.params;
  const name = parts.join("/");

  if (!name || name.includes("..") || name.includes("\\") || path.isAbsolute(name)) {
    return new NextResponse("Geçersiz dosya", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", name);

  try {
    await access(filePath, constants.R_OK);
  } catch {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  const data = await readFile(filePath);
  const ext = path.extname(name).toLowerCase();
  const type = MIME[ext] ?? "application/octet-stream";

  return new NextResponse(data, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
