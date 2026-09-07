import { NextRequest, NextResponse } from "next/server";
import { access, readFile } from "fs/promises";
import { constants } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function uploadRoot() {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), "data", "uploads");
}

async function readUpload(name: string) {
  const candidates = [
    path.join(uploadRoot(), name),
    path.join(process.cwd(), "public", "uploads", name),
  ];

  for (const filePath of candidates) {
    try {
      await access(filePath, constants.R_OK);
      return await readFile(filePath);
    } catch {
      // try next
    }
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await context.params;
  const name = parts.join("/");

  if (
    !name ||
    name.includes("..") ||
    name.includes("\\") ||
    name.includes("\0") ||
    path.isAbsolute(name)
  ) {
    return new NextResponse("Geçersiz dosya", { status: 400 });
  }

  const data = await readUpload(name);
  if (!data) {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  const ext = path.extname(name).toLowerCase();
  const type = MIME[ext] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
