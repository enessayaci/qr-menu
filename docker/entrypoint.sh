#!/bin/sh
set -e

mkdir -p /app/data /app/data/uploads

# Eski public/uploads konumundan taşı (varsa)
if [ -d /app/public/uploads ]; then
  for f in /app/public/uploads/*; do
    [ -e "$f" ] || continue
    base=$(basename "$f")
    if [ ! -e "/app/data/uploads/$base" ]; then
      cp -n "$f" "/app/data/uploads/$base" 2>/dev/null || true
    fi
  done
fi

echo ">> Veritabanı senkronize ediliyor..."
node ./node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma

echo ">> İlk kurulum kontrolü..."
node ./scripts/seed-if-empty.mjs

echo ">> Upload dir: ${UPLOAD_DIR:-/app/data/uploads}"
echo ">> By Balet menü başlatılıyor (port ${PORT:-3000})..."
exec node server.js
